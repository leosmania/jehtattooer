'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import Konva from 'konva'
import styles from './TattooSimulator.module.css'

type SimulatorStep = 'upload-body' | 'upload-tattoo' | 'processing' | 'editor'

export default function TattooSimulator() {
  const [step, setStep] = useState<SimulatorStep>('upload-body')
  const [bodyImage, setBodyImage] = useState<HTMLImageElement | null>(null)
  const [tattooImage, setTattooImage] = useState<HTMLImageElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: 600, height: 600 })
  const [tattooOpacity, setTattooOpacity] = useState(0.85)
  const [isSelected, setIsSelected] = useState(true)
  const [processingProgress, setProcessingProgress] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const tattooRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  // Responsive stage sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth, 800)
        setStageSize({ width, height: width })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Attach transformer to tattoo
  useEffect(() => {
    if (isSelected && transformerRef.current && tattooRef.current) {
      transformerRef.current.nodes([tattooRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, tattooImage])

  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }, [])

  const loadFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const removeBackground = useCallback(async (file: File): Promise<HTMLImageElement> => {
    setProcessingProgress('Carregando modelo de IA (primeira vez pode demorar)...')
    const { removeBackground: removeBg } = await import('@imgly/background-removal')

    setProcessingProgress('Removendo fundo da imagem...')
    const blob = await removeBg(file, {
      progress: (key: string, current: number, total: number) => {
        if (key === 'compute:inference') {
          const pct = Math.round((current / total) * 100)
          setProcessingProgress(`Removendo fundo... ${pct}%`)
        }
      },
    })

    const url = URL.createObjectURL(blob)
    const img = await loadImage(url)
    return img
  }, [loadImage])

  const handleBodyUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await loadFileAsDataURL(file)
    const img = await loadImage(dataUrl)
    setBodyImage(img)
    setStep('upload-tattoo')
  }, [loadFileAsDataURL, loadImage])

  const handleTattooUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStep('processing')
    try {
      const img = await removeBackground(file)
      setTattooImage(img)
      setStep('editor')
    } catch {
      // Fallback: use original image if bg removal fails
      const dataUrl = await loadFileAsDataURL(file)
      const img = await loadImage(dataUrl)
      setTattooImage(img)
      setStep('editor')
    }
  }, [removeBackground, loadFileAsDataURL, loadImage])

  const getBodyImageProps = useCallback(() => {
    if (!bodyImage) return { x: 0, y: 0, width: stageSize.width, height: stageSize.height }
    const scale = Math.min(stageSize.width / bodyImage.width, stageSize.height / bodyImage.height)
    const width = bodyImage.width * scale
    const height = bodyImage.height * scale
    return {
      x: (stageSize.width - width) / 2,
      y: (stageSize.height - height) / 2,
      width,
      height,
    }
  }, [bodyImage, stageSize])

  const getTattooInitialProps = useCallback(() => {
    if (!tattooImage) return { x: 0, y: 0, width: 150, height: 150 }
    const maxSize = stageSize.width * 0.3
    const scale = Math.min(maxSize / tattooImage.width, maxSize / tattooImage.height)
    return {
      x: stageSize.width / 2 - (tattooImage.width * scale) / 2,
      y: stageSize.height / 2 - (tattooImage.height * scale) / 2,
      width: tattooImage.width * scale,
      height: tattooImage.height * scale,
    }
  }, [tattooImage, stageSize])

  const handleExport = useCallback(() => {
    if (!stageRef.current) return
    setIsSelected(false)
    setTimeout(() => {
      const uri = stageRef.current!.toDataURL({ pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'minha-tatuagem-preview.png'
      link.href = uri
      link.click()
      setIsSelected(true)
    }, 100)
  }, [])

  const handleReset = useCallback(() => {
    setBodyImage(null)
    setTattooImage(null)
    setStep('upload-body')
    setTattooOpacity(0.85)
    setIsSelected(true)
    setProcessingProgress('')
  }, [])

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image' && e.target !== tattooRef.current) {
      setIsSelected(false)
    }
  }, [])

  const handleTattooClick = useCallback(() => {
    setIsSelected(true)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.divider} />
      <div className={styles.header}>
        <h2>Simulador de Tatuagem</h2>
        <p>Visualize como sua tatuagem ficará antes de tatuar</p>
      </div>

      {/* Step indicators */}
      <div className={styles.steps}>
        <div className={`${styles.step} ${step === 'upload-body' ? styles.active : ''} ${step !== 'upload-body' ? styles.done : ''}`}>
          1. Foto do corpo
        </div>
        <div className={`${styles.step} ${step === 'upload-tattoo' || step === 'processing' ? styles.active : ''} ${step === 'editor' ? styles.done : ''}`}>
          2. Desenho da tattoo
        </div>
        <div className={`${styles.step} ${step === 'editor' ? styles.active : ''}`}>
          3. Posicionar
        </div>
      </div>

      {/* Upload body photo */}
      {step === 'upload-body' && (
        <div className={styles.uploadArea}>
          <div className={styles.uploadIcon}>📷</div>
          <h2>Escolha a foto do corpo</h2>
          <p>Tire uma foto ou escolha da galeria a parte do corpo onde deseja a tatuagem</p>
          <label className={styles.uploadBtn}>
            Escolher foto
            <input
              type="file"
              accept="image/*"
              onChange={handleBodyUpload}
              hidden
            />
          </label>
        </div>
      )}

      {/* Upload tattoo design */}
      {step === 'upload-tattoo' && (
        <div className={styles.uploadArea}>
          <div className={styles.uploadIcon}>🎨</div>
          <h2>Escolha o desenho da tatuagem</h2>
          <p>Envie o desenho que deseja testar. O fundo será removido automaticamente!</p>
          <label className={styles.uploadBtn}>
            Escolher desenho
            <input
              type="file"
              accept="image/*"
              onChange={handleTattooUpload}
              hidden
            />
          </label>
          <button className={styles.backBtn} onClick={() => setStep('upload-body')}>
            Voltar
          </button>
        </div>
      )}

      {/* Processing / removing background */}
      {step === 'processing' && (
        <div className={styles.uploadArea}>
          <div className={styles.spinner} />
          <h2>Processando imagem...</h2>
          <p className={styles.processingText}>{processingProgress}</p>
        </div>
      )}

      {/* Editor */}
      {step === 'editor' && bodyImage && tattooImage && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              <label className={styles.toolLabel}>Opacidade</label>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={tattooOpacity}
                onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
            <div className={styles.toolActions}>
              <button className={styles.actionBtn} onClick={handleExport}>
                Salvar imagem
              </button>
              <button className={styles.resetBtn} onClick={handleReset}>
                Recomeçar
              </button>
            </div>
          </div>

          <p className={styles.hint}>Arraste, redimensione e gire o desenho para posicionar</p>

          <div ref={containerRef} className={styles.editorContainer}>
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onClick={handleStageClick}
              onTap={handleStageClick}
            >
              <Layer>
                {/* Body photo background */}
                <KonvaImage
                  image={bodyImage}
                  {...getBodyImageProps()}
                  listening={false}
                />

                {/* Tattoo overlay */}
                <KonvaImage
                  ref={tattooRef}
                  image={tattooImage}
                  {...getTattooInitialProps()}
                  draggable
                  opacity={tattooOpacity}
                  onClick={handleTattooClick}
                  onTap={handleTattooClick}
                />

                {/* Transformer for resize/rotate */}
                {isSelected && (
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    enabledAnchors={[
                      'top-left', 'top-right',
                      'bottom-left', 'bottom-right',
                    ]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 20 || newBox.height < 20) return oldBox
                      return newBox
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>

          <div className={styles.shareSection}>
            <p>Gostou do resultado? Salve a imagem e compartilhe!</p>
          </div>
        </>
      )}
    </div>
  )
}
