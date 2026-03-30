'use client'

import { useState, useTransition } from 'react'
import { submitAnamnesisAction } from '@/app/actions/crm/submitAnamnesis'
import styles from './AnamnesisForm.module.css'

interface Props {
  token: string
  clientNome: string
  clientEmail: string
  clientWhatsapp: string
}

const DOENCAS = [
  'Diabetes',
  'Doenças infectocontagiosas',
  'Epilepsia',
  'Hemofilia',
  'Problemas de cicatrização',
  'Propensão a quelóide',
  'Hipersensibilidade a compostos químicos',
]

const CONDICOES_PELE = [
  'Vitiligo (provoca perda de coloração em determinadas regiões)',
  'Dermatite atópica',
  'Eczema',
  'Escabiose (Sarna)',
  'Melanoma',
  'Psoríase',
]

const HISTORICO_ALERGIAS = [
  'Cicatrização',
  'Doenças',
  'Ataque alérgico',
]

const TERMOS = `ORIENTAÇÕES PRÉ-PROCEDIMENTO

Antes de tatuar, é importante que você saiba que a tatuagem causa uma leve inflamação, portanto é necessário que você compare o tempo necessário para a cicatrização. Após cada sessão de tatuagem, há criação de uma nova arte onde o processo é semelhante ao seguinte: tenhamos como que a tatuagem não desaparece antes do tempo que você espera, isto é, de no mínimo 25h.

CUIDADOS PARA TATUAR
– Prepare a sua pele pelo menos 1 semana antes (exfolie a parte do corpo para tatuar)
– Durma bem antes (uma boa noite de sono faz toda a diferença para sua imunidade)
– Alimente-se bem no dia da sessão — nunca vá em jejum
– Evite o uso de cremes hidratantes na área que vai tatuar no dia anterior
– Não é indicado usar acompanhantes para a sessão, e isso é necessário para que o espaço e o ambiente seja adequado para você
– Evite tomar bebidas alcoólicas 48h antes
– Evite tomar aspirina ou outros anticoagulantes antes, pois pode retardar a cicatrização em sua avaliação

SOBRE A CICATRIZAÇÃO
Cada metabolismo reage de forma diferente. Por isso, algumas pessoas cicatrizam muito bem e com muito pouco desconforto, e outras podem precisar de mais sessões.

TATUAGEM É PROCESSO E REQUER PACIÊNCIA. Não espere chegar aos resultados antes do tempo. Caso não tenha problema, os toques precisam ser realizados.

SOBRE RESULTADOS
TATUAGEM É UM PROCESSO E REQUER PACIÊNCIA. NÃO ESPERE CHEGAR A RESULTADOS ANTES DO TEMPO. TATUAGENS REALIZADAS COM MUITO TEMPO PASSADO NA MESMA POSIÇÃO podem resultar em reações adversas que serão tratadas no menor tempo possível.

SOBRE O PAGAMENTO
Para finalizar um agendamento, é cobrado um sinal de 50%, que será pago por via Pix/transferência bancária. Em caso de desistência, o sinal não é reembolsado. O agendamento é confirmado após 7 dias de antecedência. O pagamento do saldo restante é feito no dia da sessão.

ORÇAMENTO
AO INICIAR UM PROJETO, LEVO EM CONSIDERAÇÃO: TAMANHO, NÍVEL DE DETALHES, ESTILO. O CLIENTE DEVE INFORMAR ANTES DO MOMENTO. CASO O CLIENTE SOLICITE TAMANHO MAIOR OU MENOR APÓS STENCIL, COMA OS OLHOS TAMBÉM COMO. O TIME TATTOO NUNCA O CUSTO ADICIONAL NÃO VALOR SERÁ OS MAIS.`

export default function AnamnesisForm({ token, clientNome, clientEmail, clientWhatsapp }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Dados pessoais complementares
  const [dataNascimento, setDataNascimento] = useState('')
  const [profissao, setProfissao] = useState('')

  // Saúde
  const [doencasSelecionadas, setDoencasSelecionadas] = useState<string[]>([])
  const [semDoenca, setSemDoenca] = useState(false)
  const [condicoesPeleSelecionadas, setCondicoesPeleSelecionadas] = useState<string[]>([])
  const [semCondicaoPele, setSemCondicaoPele] = useState(false)
  const [pressaoArterial, setPressaoArterial] = useState('')

  // Alergias
  const [historicoAlergias, setHistoricoAlergias] = useState<string[]>([])
  const [semAlergia, setSemAlergia] = useState(false)
  const [descricaoAlergias, setDescricaoAlergias] = useState('')

  // Estado atual
  const [gestante, setGestante] = useState<boolean | null>(null)
  const [usoAlcoolDrogas, setUsoAlcoolDrogas] = useState<boolean | null>(null)
  const [emTratamento, setEmTratamento] = useState<boolean | null>(null)
  const [medicamentos, setMedicamentos] = useState('')

  // Extras
  const [experiencias, setExperiencias] = useState('')
  const [outrasInfo, setOutrasInfo] = useState('')

  // Termos
  const [aceitaTermos, setAceitaTermos] = useState(false)
  const [aceitaResponsabilidade, setAceitaResponsabilidade] = useState(false)

  function toggleDoenca(doenca: string) {
    setSemDoenca(false)
    setDoencasSelecionadas(prev =>
      prev.includes(doenca) ? prev.filter(d => d !== doenca) : [...prev, doenca]
    )
  }

  function toggleCondicaoPele(condicao: string) {
    setSemCondicaoPele(false)
    setCondicoesPeleSelecionadas(prev =>
      prev.includes(condicao) ? prev.filter(c => c !== condicao) : [...prev, condicao]
    )
  }

  function toggleHistoricoAlergia(tipo: string) {
    setSemAlergia(false)
    setHistoricoAlergias(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (gestante === null) { setError('Informe se está grávida ou lactante.'); return }
    if (usoAlcoolDrogas === null) { setError('Informe sobre uso de álcool/drogas.'); return }
    if (emTratamento === null) { setError('Informe se está em tratamento médico.'); return }
    if (!pressaoArterial) { setError('Informe sua pressão arterial.'); return }
    if (!aceitaTermos) { setError('Você precisa aceitar os termos de responsabilidade.'); return }
    if (!aceitaResponsabilidade) { setError('Você precisa confirmar a responsabilidade pela escolha da tatuagem.'); return }

    const condicoesSaude = semDoenca ? 'Nenhuma' : doencasSelecionadas.join(', ') || 'Nenhuma'
    const condicoesPele = semCondicaoPele ? 'Nenhuma' : condicoesPeleSelecionadas.join(', ') || 'Nenhuma'
    const histAlergias = semAlergia ? 'Não' : historicoAlergias.join(', ') || 'Não'

    startTransition(async () => {
      const result = await submitAnamnesisAction(token, {
        data_nascimento: dataNascimento,
        profissao,
        condicoes_saude: condicoesSaude,
        condicoes_pele: condicoesPele,
        pressao_arterial: pressaoArterial,
        historico_alergias: histAlergias,
        alergias: descricaoAlergias,
        gestante: gestante,
        uso_alcool_drogas: usoAlcoolDrogas,
        em_tratamento: emTratamento,
        medicamentos,
        experiencias_tatuagem: experiencias,
        outras_informacoes: outrasInfo,
        aceita_termos: aceitaTermos,
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || 'Erro ao enviar. Tente novamente.')
      }
    })
  }

  if (submitted) {
    return (
      <div className={styles.form}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✅</div>
          <h2>Ficha enviada com sucesso!</h2>
          <p>Obrigada, <strong>{clientNome}</strong>! Sua ficha de anamnese foi recebida.</p>
          <p>A Jéssica irá analisá-la e entrará em contato para confirmar o agendamento.</p>
          <p className={styles.successNote}>
            Qualquer dúvida, fale pelo WhatsApp da Jéssica. Até lá! 🌿
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Cabeçalho */}
      <div className={styles.header}>
        <h1>Ficha de Anamnese</h1>
        <p>
          O preenchimento desta ficha é indispensável antes de qualquer procedimento. As informações são
          tratadas com total confidencialidade e nos ajudam a garantir um atendimento seguro para você.
        </p>
      </div>

      {/* Seção 1: Informações pessoais */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Informações Pessoais</h2>

        <div className={styles.readonlyGroup}>
          <span className={styles.readonlyLabel}>Nome</span>
          <span className={styles.readonlyValue}>{clientNome}</span>
        </div>
        <div className={styles.readonlyGroup}>
          <span className={styles.readonlyLabel}>E-mail</span>
          <span className={styles.readonlyValue}>{clientEmail}</span>
        </div>
        <div className={styles.readonlyGroup}>
          <span className={styles.readonlyLabel}>WhatsApp</span>
          <span className={styles.readonlyValue}>{clientWhatsapp}</span>
        </div>

        <div className={styles.grid2}>
          <div className={styles.group}>
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={e => setDataNascimento(e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="profissao">Profissão</label>
            <input
              id="profissao"
              type="text"
              placeholder="Sua profissão"
              value={profissao}
              onChange={e => setProfissao(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Seção 2: Condições de Saúde */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Condições de Saúde</h2>

        <div className={styles.group}>
          <label>Você possui alguma doença? <span className={styles.required}>*</span></label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={semDoenca}
                onChange={e => {
                  setSemDoenca(e.target.checked)
                  if (e.target.checked) setDoencasSelecionadas([])
                }}
              />
              Não
            </label>
            {DOENCAS.map(doenca => (
              <label key={doenca} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={doencasSelecionadas.includes(doenca)}
                  onChange={() => toggleDoenca(doenca)}
                />
                {doenca}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <label>Possui alguma alteração de pele? <span className={styles.required}>*</span></label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={semCondicaoPele}
                onChange={e => {
                  setSemCondicaoPele(e.target.checked)
                  if (e.target.checked) setCondicoesPeleSelecionadas([])
                }}
              />
              Não
            </label>
            {CONDICOES_PELE.map(cond => (
              <label key={cond} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={condicoesPeleSelecionadas.includes(cond)}
                  onChange={() => toggleCondicaoPele(cond)}
                />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <label>Sua pressão arterial é? <span className={styles.required}>*</span></label>
          <div className={styles.radioGroup}>
            {['Baixa', 'Normal', 'Alta'].map(op => (
              <label key={op} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="pressao"
                  value={op}
                  checked={pressaoArterial === op}
                  onChange={() => setPressaoArterial(op)}
                />
                {op}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 3: Alergias */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Histórico de Alergias</h2>

        <div className={styles.group}>
          <label>Você tem histórico de alguma reação alérgica? <span className={styles.required}>*</span></label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={semAlergia}
                onChange={e => {
                  setSemAlergia(e.target.checked)
                  if (e.target.checked) setHistoricoAlergias([])
                }}
              />
              Não
            </label>
            {HISTORICO_ALERGIAS.map(tipo => (
              <label key={tipo} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={historicoAlergias.includes(tipo)}
                  onChange={() => toggleHistoricoAlergia(tipo)}
                />
                {tipo}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <label htmlFor="descricaoAlergias">
            Você já teve reações alérgicas na pele? Se sim, a quê?
          </label>
          <textarea
            id="descricaoAlergias"
            rows={3}
            placeholder="Descreva se já teve reações alérgicas cutâneas e a qual substância..."
            value={descricaoAlergias}
            onChange={e => setDescricaoAlergias(e.target.value)}
          />
        </div>
      </section>

      {/* Seção 4: Estado Atual */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Estado Atual</h2>

        <div className={styles.group}>
          <label>Você está grávida ou é lactante? <span className={styles.required}>*</span></label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gestante"
                checked={gestante === false}
                onChange={() => setGestante(false)}
              />
              Não
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gestante"
                checked={gestante === true}
                onChange={() => setGestante(true)}
              />
              Sim
            </label>
          </div>
        </div>

        <div className={styles.group}>
          <label>
            Você está fazendo uso de alguma droga, bebida alcoólica ou psicotrópicos?{' '}
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="alcoolDrogas"
                checked={usoAlcoolDrogas === false}
                onChange={() => setUsoAlcoolDrogas(false)}
              />
              Não
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="alcoolDrogas"
                checked={usoAlcoolDrogas === true}
                onChange={() => setUsoAlcoolDrogas(true)}
              />
              Sim
            </label>
          </div>
        </div>

        <div className={styles.group}>
          <label>
            Você está em tratamento com algum medicamento neste momento?{' '}
            <span className={styles.subLabel}>(anti-inflamatório, antibiótico, anticoagulante, etc.)</span>{' '}
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="emTratamento"
                checked={emTratamento === false}
                onChange={() => setEmTratamento(false)}
              />
              Não
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="emTratamento"
                checked={emTratamento === true}
                onChange={() => setEmTratamento(true)}
              />
              Sim
            </label>
          </div>
        </div>

        {emTratamento && (
          <div className={styles.group}>
            <label htmlFor="medicamentos">Quais medicamentos?</label>
            <textarea
              id="medicamentos"
              rows={2}
              placeholder="Informe os medicamentos que está tomando..."
              value={medicamentos}
              onChange={e => setMedicamentos(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Seção 5: Experiências */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Experiências com Tatuagem</h2>

        <div className={styles.group}>
          <label htmlFor="experiencias">
            Já fez alguma tatuagem antes? Como foi sua experiência (cicatrização, reações, etc.)?
          </label>
          <textarea
            id="experiencias"
            rows={3}
            placeholder="Conte sobre experiências anteriores com tatuagem, se houver..."
            value={experiencias}
            onChange={e => setExperiencias(e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="outrasInfo">Outras informações relevantes</label>
          <textarea
            id="outrasInfo"
            rows={3}
            placeholder="Alguma informação adicional que acha importante compartilhar?"
            value={outrasInfo}
            onChange={e => setOutrasInfo(e.target.value)}
          />
        </div>
      </section>

      {/* Seção 6: Termos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Termos de Responsabilidade e Orientações</h2>

        <div className={styles.termsBox}>
          <pre className={styles.termsText}>{TERMOS}</pre>
        </div>

        <div className={styles.group} style={{ marginTop: 'var(--spacing-lg)' }}>
          <label className={`${styles.checkboxLabel} ${styles.termsCheckbox}`}>
            <input
              type="checkbox"
              checked={aceitaTermos}
              onChange={e => setAceitaTermos(e.target.checked)}
              required
            />
            Estou ciente e comprometida(o) com as orientações acima, incluindo as normas de pagamento.
            <span className={styles.required}> *</span>
          </label>
        </div>

        <div className={styles.group}>
          <label className={`${styles.checkboxLabel} ${styles.termsCheckbox}`}>
            <input
              type="checkbox"
              checked={aceitaResponsabilidade}
              onChange={e => setAceitaResponsabilidade(e.target.checked)}
              required
            />
            Estou ciente de que sou responsável pela escolha da tatuagem e das artes, tendo aprovado o design antes de iniciar o procedimento.
            <span className={styles.required}> *</span>
          </label>
        </div>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isPending}
      >
        {isPending ? 'Enviando...' : 'Enviar Ficha de Anamnese'}
      </button>
    </form>
  )
}
