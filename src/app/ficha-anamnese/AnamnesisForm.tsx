'use client'

import { useState, useTransition } from 'react'

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return value
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
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
  'Dermatite de contato',
  'Eczema',
  'Escabiose (Sarna)',
  'Melasma',
  'Psoríase',
]

const HISTORICO = [
  'Convulsão',
  'Desmaio',
  'Ataque alérgico',
]

const TERMOS = `TERMO DE RESPONSABILIDADE E ORIENTAÇÕES PRÉ-PROCEDIMENTO

Orientações para nosso atendimento ser ainda mais legal e agradável :)

Pense bem antes de reservar o horário — não agende para uma data que você tenha outros compromissos, pois a tattoo é uma arte, e arte requer tempo e tranquilidade. Afinal, a intenção é que ela fique pra sempre com você, e você separar o tempo necessário para um bom resultado é o começo dessa parceria.

Não troque a arte no momento do procedimento. Cada horário é reservado com um tempo estimado de execução; a criação de uma nova arte pode prejudicar o próximo horário, ou fazer com que o horário agendado seja desperdiçado em caso de trocas por artes mais simples. Comunique qualquer mudança de arte com no mínimo 24h de antecedência.

──────────────────────────────────────
PREPARE SUA PELE PARA TATUAR

• Tome bastante água (para hidratar a pele de dentro para fora)
• Faça uma esfoliação na área que irá tatuar (para afinar a camada externa da pele)
• Assim que decidir tatuar, inicie um intensivo de hidratação — hidrate generosamente ao menos 3 vezes ao dia
• Escolha sua roupa pensando na área que irá tatuar
• Venha bem alimentada — se sua tattoo for grande, faremos uma pausa e você pode trazer uma marmitinha se preferir
• Não é indicado trazer acompanhantes, pois a espera é cansativa e pode acabar trazendo preocupação no seu momento especial
• Não é permitida a presença de crianças — este momento é seu, e o ambiente sem estímulos e com muita espera pode ser muito desconfortável para elas
• Evite atrasos excessivos ou chegar muito antes do horário. Se precisar atrasar um pouquinho não tem problema — estarei preparada para isso — mas avise. Se precisar se adiantar, avise também
• Não beba nem use nenhuma substância psicoativa antes da sua tattoo; pode causar reações adversas para as quais não tenho preparo para lidar
• TATUAGEM É UM PROCESSO DEMORADO. PRESSA É INIMIGA DE BONS RESULTADOS. VENHA PREPARADA TANTO FISICAMENTE QUANTO MENTALMENTE PARA A POSSIBILIDADE DE PASSAR MUITO TEMPO PARADA NA MESMA POSIÇÃO

──────────────────────────────────────
Tatuar é maravilhoso — é um momento em que você estará eternizando uma escolha em seu corpo. Se você me escolheu, confie e fique tranquila. Venha de coração aberto que iremos juntas fazer deste momento o mais agradável possível. Deixe toda e qualquer energia duvidosa para trás, e vamos viver essa experiência com leveza e alegria.

Estou feliz em recebê-la aqui. Grata pela sua confiança. Até logo. 🌿

──────────────────────────────────────
SOBRE O PAGAMENTO DO SINAL

Para finalizar seu agendamento, é cobrado um sinal de R$100,00, que pode ser pago por Pix, transferência ou depósito. Este valor será descontado do valor da sua tattoo.

O agendamento é confirmado após o envio do comprovante de pagamento (pelo WhatsApp).

O sinal não tem estorno em casos de desistência, cancelamento ou falta. Se necessário, você poderá reagendar com 48h de antecedência (1 vez dentro do prazo de 30 dias corridos). Após efetuar o pagamento do sinal, o cliente terá 30 dias corridos para realizar o agendamento.

Em caso de projetos maiores (2 sessões ou mais), o prazo máximo entre uma sessão e outra é de 30 dias.

──────────────────────────────────────
IMPORTANTE — ORÇAMENTO

AO ORÇAR SEU PROJETO, LEVO EM CONSIDERAÇÃO O TAMANHO, ÁREA E DETALHES SUGERIDOS PELO CLIENTE ANTES DO ORÇAMENTO. CASO O CLIENTE QUEIRA COMPLEMENTAR (ADICIONAR DETALHES, AUMENTAR TAMANHO, TROCAR A ARTE DE UMA ÁREA SIMPLES PARA UMA ÁREA SENSÍVEL COMO COSTELA, CLAVÍCULA, PESCOÇO, MÃOS, PÉS ETC.) ANTES OU NA HORA DA TATTOO, HAVERÁ UM CUSTO ADICIONAL AO VALOR DADO NO INÍCIO.`

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

  // Histórico
  const [historico, setHistorico] = useState<string[]>([])
  const [semHistorico, setSemHistorico] = useState(false)
  const [descricaoAlergias, setDescricaoAlergias] = useState('')

  // Estado atual
  const [gestante, setGestante] = useState<boolean | null>(null)
  const [usoAlcoolDrogas, setUsoAlcoolDrogas] = useState<boolean | null>(null)
  const [emTratamento, setEmTratamento] = useState<boolean | null>(null)
  const [medicamentos, setMedicamentos] = useState('')
  const [propensaoQueloide, setPropensaoQueloide] = useState<boolean | null>(null)

  // Extras
  const [experiencias, setExperiencias] = useState('')
  const [outrasInfo, setOutrasInfo] = useState('')

  // Termos
  const [compromissoPagamento, setCompromissoPagamento] = useState('')
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

  function toggleHistorico(tipo: string) {
    setSemHistorico(false)
    setHistorico(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!pressaoArterial) { setError('Informe sua pressão arterial.'); return }
    if (gestante === null) { setError('Informe se está grávida ou lactante.'); return }
    if (usoAlcoolDrogas === null) { setError('Informe sobre uso de substâncias psicoativas.'); return }
    if (emTratamento === null) { setError('Informe se está em tratamento com medicamentos.'); return }
    if (propensaoQueloide === null) { setError('Informe se tem propensão a quelóide.'); return }
    if (!compromissoPagamento) { setError('Selecione uma opção sobre o pagamento do sinal.'); return }
    if (!aceitaTermos) { setError('Você precisa aceitar os termos de responsabilidade.'); return }
    if (!aceitaResponsabilidade) { setError('Você precisa confirmar a responsabilidade pela escolha da tatuagem.'); return }

    const condicoesSaude = semDoenca ? 'Nenhuma' : doencasSelecionadas.join(', ') || 'Nenhuma'
    const condicoesPele = semCondicaoPele ? 'Nenhuma' : condicoesPeleSelecionadas.join(', ') || 'Nenhuma'
    const hist = semHistorico ? 'Não' : historico.join(', ') || 'Não'

    startTransition(async () => {
      const result = await submitAnamnesisAction(token, {
        data_nascimento: dataNascimento,
        profissao,
        condicoes_saude: condicoesSaude,
        condicoes_pele: condicoesPele,
        pressao_arterial: pressaoArterial,
        historico_alergias: hist,
        alergias: descricaoAlergias,
        gestante: gestante,
        uso_alcool_drogas: usoAlcoolDrogas,
        em_tratamento: emTratamento,
        medicamentos,
        propensao_queloide: propensaoQueloide,
        experiencias_tatuagem: experiencias,
        outras_informacoes: outrasInfo,
        compromisso_pagamento: compromissoPagamento,
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
          <span className={styles.readonlyValue}>{formatPhone(clientWhatsapp)}</span>
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

      {/* Seção 3: Histórico */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Histórico de Saúde</h2>

        <div className={styles.group}>
          <label>Você tem histórico de... <span className={styles.required}>*</span></label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={semHistorico}
                onChange={e => {
                  setSemHistorico(e.target.checked)
                  if (e.target.checked) setHistorico([])
                }}
              />
              Não
            </label>
            {HISTORICO.map(tipo => (
              <label key={tipo} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={historico.includes(tipo)}
                  onChange={() => toggleHistorico(tipo)}
                />
                {tipo}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <label htmlFor="descricaoAlergias">
            Você já teve reações alérgicas com sintomas na pele? Se sim, a quê?
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

        <div className={styles.group}>
          <label>
            Você tem propensão a quelóide? <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="propensaoQueloide"
                checked={propensaoQueloide === false}
                onChange={() => setPropensaoQueloide(false)}
              />
              Não
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="propensaoQueloide"
                checked={propensaoQueloide === true}
                onChange={() => setPropensaoQueloide(true)}
              />
              Sim
            </label>
          </div>
        </div>
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
          <label>
            Sobre o pagamento do sinal: <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup} style={{ flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="compromissoPagamento"
                value="comprovante_whatsapp"
                checked={compromissoPagamento === 'comprovante_whatsapp'}
                onChange={() => setCompromissoPagamento('comprovante_whatsapp')}
              />
              Vou enviar o comprovante pelo WhatsApp
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="compromissoPagamento"
                value="negociar_whatsapp"
                checked={compromissoPagamento === 'negociar_whatsapp'}
                onChange={() => setCompromissoPagamento('negociar_whatsapp')}
              />
              No momento estou impossibilitada de realizar o pagamento do sinal — irei negociar pelo WhatsApp
            </label>
          </div>
        </div>

        <div className={styles.group}>
          <label className={`${styles.checkboxLabel} ${styles.termsCheckbox}`}>
            <input
              type="checkbox"
              checked={aceitaTermos}
              onChange={e => setAceitaTermos(e.target.checked)}
              required
            />
            Li e estou ciente das orientações pré-procedimento e das condições de pagamento do sinal descritas acima.
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
            Estou ciente de que sou a única e inteiramente responsável pela escolha e aprovação da arte e da área escolhida para tatuar, isentando a profissional de qualquer ônus ou processo decorrente dessa decisão. Concordo e me responsabilizo pela minha escolha.
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
