import { Secao } from '../Secao'

// Por enquanto só a abertura da seção: o formulário em 3 etapas e o painel
// "Eventos disparados" entram no bloco 5. Os CTAs da página já apontam para cá
export function Inscricao() {
  return (
    <Secao
      id="inscricao"
      titulo="Inscrição"
      subtitulo="Leva menos de 1 minuto. Todos os campos são obrigatórios."
      nota="Esta é uma demonstração: nada do que você digitar sai do seu navegador."
    />
  )
}
