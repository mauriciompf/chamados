export default function Home() {
  return (
    <main>
      <div className="grid place-items-center">
        <h3 className="text-3xl font-bold text-center">
          Tabela de Socilitações de Chamados de Alterações
        </h3>

        <button className="mt-12 bg-white p-4 font-bold text-black text-xl rounded-3xl">
          Adicionar nova solicitação
        </button>

        <table className="mt-12">
          <thead>
            <th className="border px-2 py-2">ID</th>
            <th className="border px-4 py-2">DATA</th>
            <th className="border px-2 py-2">SEMANA</th>
            <th className="border px-12 py-2">TICKET</th>
            <th className="border px-6 py-2">CÓDIGO</th>
            <th className="border px-10 py-2">STATUS</th>
            <th className="border px-6 py-2">TIPO</th>
            <th className="border px-12 py-2">LINK</th>
          </thead>
        </table>
      </div>
    </main>
  );
}
