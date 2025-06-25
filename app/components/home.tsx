"use client";

import { ChangeEvent, useState } from "react";
import { create } from "./create";

function Home() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticket, setTicket] = useState<string | number>();
  const [selectDate, setSelectDate] = useState<string | number>("24/06/2025");

  const handleTicketModal = () => {
    setIsTicketModalOpen(true);
  };

  const handleTicket = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTicket(value);
  };

  const handleDate = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectDate(value);
  };

  // const create = async (formData: FormData) => {
  //   "use server";
  //   const sql = neon(`${process.env.DATABASE_URL}`);
  //   const ticket = formData.get("ticket");
  //   const date = formData.get("date");

  //   await sql("INSERT INTO chamados VALUES ($1, $2)", [ticket, date]);
  // };

  return (
    <main>
      <div className="grid place-items-center">
        {/* MODAL */}

        {isTicketModalOpen && (
          <form
            // onSubmit={handleOnSubmit}
            action={create}
            className="pt-10 grid gap-y-1 w-[600px] h-[400px] bg-amber-50 text-black rounded-xl p-4 absolute -translate-y-[50%] top-[50%]"
          >
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="cursor-pointer absolute top-2 right-2 bg-red-400 font-bold pt-1 rounded-full w-fit grid place-items-center px-2"
            >
              fechar
            </button>

            <div className="flex justify-between items-center">
              <p>
                <strong>ID</strong>:{" "}
                <span className="text-sm bg-gray-500 text-white p-1 rounded-2xl ">
                  0001
                </span>
              </p>

              <div className="flex items-center">
                <p className="mr-4">
                  <strong>Data</strong>:
                </p>
                <select
                  onChange={handleDate}
                  value={selectDate}
                  className="border"
                  name="date"
                  id="date"
                >
                  <option value="2025-06-26">Hoje</option>
                  <option value="">Amanhã</option>
                  <option value="">Escolher Data</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="" className="mr-2">
                  <strong>Ticket</strong>:
                </label>
                <input
                  type="text"
                  name="ticket"
                  value={ticket}
                  onChange={handleTicket}
                  className="border-b"
                />
              </div>

              <div className="flex items-center">
                <p className="mr-4">
                  <strong>Tipo</strong>:
                </p>
                <select className="border " name="" id="">
                  <option value="">Padrão</option>
                  <option value="">Plano de Aula</option>
                  <option value="">Pós Graduação</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="" className="mr-2">
                  <strong>Código</strong>:
                </label>
                <input className="border-b" type="text" />
              </div>

              <div className="flex items-center">
                <p className="mr-4">
                  <strong>STATUS</strong>:
                </p>
                <select className="border " name="" id="">
                  <option value="">Ativa</option>
                  <option value="">Aprovada</option>
                  <option value="">Desenvolvimento</option>
                  <option value="">Pendente</option>
                  <option value="">Salvo Local</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <p>
                <strong>LINK</strong>:{" "}
                <span className="text-sm w-fit bg-gray-500 text-white rounded-2xl p-0.5 px-2">
                  <a
                    href="https://trilhaaprendizagem.uniasselvi.com.br/164489_experiencia_profissional_temas_tranversais/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    164489_experiencia_profissional_temas_tranversais
                  </a>
                </span>
              </p>
              <div className="bg-blue-500 h-fit text-white px-2 rounded-xl text-sm cursor-pointer">
                Editar link
              </div>
            </div>

            <button className="cursor-pointer bg-gray-500 text-white rounded-2xl font-bold text-xl">
              Adicionar
            </button>
          </form>
        )}

        <h3 className="text-3xl font-bold text-center mt-14">
          Tabela de Socilitações de Chamados de Alterações
        </h3>

        <button
          type="button"
          onClick={handleTicketModal}
          className="cursor-pointer mt-12 bg-white p-4 font-bold text-black text-xl rounded-3xl"
        >
          Adicionar nova solicitação
        </button>

        <table className="mt-12">
          <thead>
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-4 py-2">DATA</th>
              <th className="border px-2 py-2">SEMANA</th>
              <th className="border px-12 py-2">TICKET</th>
              <th className="border px-6 py-2">CÓDIGO</th>
              <th className="border px-10 py-2">STATUS</th>
              <th className="border px-6 py-2">TIPO</th>
              <th className="border px-12 py-2">LINK</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </main>
  );
}

export default Home;
