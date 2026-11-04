import { useState } from 'react'
import { Toast } from '@/index'
import { useInscricao } from '@/demo/inscricao/store'
import { planos, type Plano } from '@/demo/planos'
import { Beneficios } from '@/demo/sections/Beneficios'
import { Cabecalho } from '@/demo/sections/Cabecalho'
import { ChamadaFinal } from '@/demo/sections/ChamadaFinal'
import { Depoimentos } from '@/demo/sections/Depoimentos'
import { Hero } from '@/demo/sections/Hero'
import { Inscricao } from '@/demo/sections/Inscricao'
import { Perguntas } from '@/demo/sections/Perguntas'
import { Planos } from '@/demo/sections/Planos'
import { Programa } from '@/demo/sections/Programa'
import { Rodape } from '@/demo/sections/Rodape'
import { SobreADemo } from '@/demo/SobreADemo'
import { track } from '@/demo/tracking'

// A landing do Hora Âmbar, montada com a API pública da biblioteca (@/index)
export function App() {
  // Só a ação: ela nunca muda, então o App não re-renderiza quando o formulário muda
  const escolherPlano = useInscricao((s) => s.escolherPlano)
  // O aviso é da página e some sozinho; o plano escolhido fica na store
  const [aviso, setAviso] = useState<string | null>(null)
  const [sobreAberto, setSobreAberto] = useState(false)

  // O card só avisa que foi escolhido (onEscolher). Quem liga a escolha à store, ao
  // evento e ao aviso é a página: a biblioteca continua sem saber do Zustand
  function aoEscolherPlano(plano: Plano) {
    escolherPlano(plano.id)
    track({
      event: 'select_item',
      ecommerce: {
        currency: 'BRL',
        item_list_id: 'planos',
        item_list_name: 'Planos',
        items: [
          {
            item_id: plano.id,
            item_name: `Hora Âmbar ${plano.nome}`,
            price: plano.preco,
            index: planos.indexOf(plano),
          },
        ],
      },
    })
    setAviso(`Plano ${plano.nome} escolhido.`)
  }

  return (
    <>
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        <Beneficios />
        {/* Bloco 6: "Onde está a luz hoje?" (#luz-hoje) entra aqui */}
        <Programa />
        <Depoimentos />
        <Planos onEscolher={aoEscolherPlano} />
        <Inscricao onAbrirSobre={() => setSobreAberto(true)} />
        <Perguntas />
        <ChamadaFinal />
      </main>
      <Rodape onAbrirSobre={() => setSobreAberto(true)} />

      <SobreADemo open={sobreAberto} onClose={() => setSobreAberto(false)} />
      {/* Montado desde o início, mesmo vazio: a região de status precisa existir antes da mensagem */}
      <Toast message={aviso} detail="Falta só a inscrição." onClose={() => setAviso(null)} />
    </>
  )
}
