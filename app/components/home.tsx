"use client";

import { ChangeEvent, FormEvent, SetStateAction, useState } from "react";
import { create, deleteTicket } from "./create";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Home() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticket, setTicket] = useState("");
  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState("desenvolvimento");
  const [tipo, setTipo] = useState("padrao");
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [calendarModal, setCalendarModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // console.log(selectDate);

  const formattedDate = selectDate.toISOString().split("T")[0];

  const handleEditTicket = (ticket: any) => {
    setEditingTicket(ticket);
    setTicket(ticket.ticket);
    setSelectDate(ticket.data ? new Date(ticket.data) : new Date());
    setCodigo(ticket.codigo);
    setStatus(ticket.status);
    setTipo(ticket.tipo);
    setIsTicketModalOpen(true);
  };
  // console.log(selectDate);

  const handleDeleteTicket = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este ticket?")) {
      try {
        await deleteTicket(id);
        await queryClient.invalidateQueries("tickets");
      } catch (error) {
        console.error("Error deleting ticket", error);
      }
    }
  };

  const handleTicketModal = () => {
    setIsTicketModalOpen(true);
  };

  const handleTicket = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTicket(value);
  };

  // const handleDate = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const value = e.target.value;
  //   setSelectDate(value);
  // };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("ticket", ticket);
    formData.append("date", formattedDate);
    formData.append("codigo", codigo);
    formData.append("status", status);
    formData.append("tipo", tipo);

    if (editingTicket) {
      formData.append("id", editingTicket.id.toString());
    }

    try {
      await create(formData);
      await queryClient.invalidateQueries("tickets");

      setTicket("");
      setSelectDate(new Date());
      setCodigo("");
      setStatus("ativa");
      setTipo("padrao");
      setEditingTicket(null);
      setIsTicketModalOpen(false);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const fetchTickets = async () => {
    const { data } = await axios.get("http://localhost:3000/pages/api");

    return data;
  };

  const { data, error, isError, isLoading } = useQuery("tickets", fetchTickets);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error! {(error as Error).message}</div>;
  }

  return (
    <main>
      <div className="grid place-items-center">
        {/* MODAL */}
        {isTicketModalOpen && (
          <form
            onSubmit={handleOnSubmit}
            action={create}
            className="pt-10 grid gap-y-1 w-[600px] h-[400px] bg-amber-50 text-black rounded-xl p-4 absolute -translate-y-[50%] top-[50%]"
          >
            {editingTicket && (
              <input type="hidden" name="id" value={editingTicket.id} />
            )}
            <button
              onClick={() => {
                setIsTicketModalOpen(false);
              }}
              type="button"
              className="cursor-pointer absolute top-2 right-2 bg-red-400 font-bold pt-1 rounded-full w-fit grid place-items-center px-2"
            >
              fechar
            </button>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <p className="mr-4">
                  <strong>Data</strong>:
                </p>

                <button
                  type="button"
                  onClick={() => setCalendarModal(!calendarModal)}
                  className="cursor-pointer font-bold bg-gray-500 text-white p-2 rounded-2xl"
                >
                  {selectDate
                    ? selectDate.toLocaleDateString()
                    : "Escolher Data"}
                </button>

                {calendarModal && (
                  <Calendar
                    className={"absolute bottom-70 left-50"}
                    onChange={(date) => {
                      setSelectDate(date as Date);
                      setCalendarModal(false);
                    }}
                    value={selectDate}
                  />
                )}

                {/* <select
                  onChange={handleDate}
                  value={selectDate}
                  className="border"
                  name="date"
                  id="date"
                >
                  <option value="2025-06-26">Hoje</option>
                  <option value="2025-06-27">Amanhã</option>
                  <option value="2025-06-27">Escolher Data</option>
                </select> */}
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
                <select className="border" name="tipo" id="">
                  <option value="padrao">Padrão</option>
                  <option value="plano_de_aula">Plano de Aula</option>
                  <option value="pos">Pós Graduação</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="" className="mr-2">
                  <strong>Código</strong>:
                </label>
                <input name="codigo" className="border-b" type="text" />
              </div>

              <div className="flex items-center">
                <p className="mr-4">
                  <strong>STATUS</strong>:
                </p>
                <select className="border " name="status" id="">
                  <option value="ativa">Ativa</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="desenvolvimento">Desenvolvimento</option>
                  <option value="pendente">Pendente</option>
                  <option value="salvo_local">Salvo Local</option>
                </select>
              </div>
            </div>
            {/* 
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
            </div> */}

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
              <th className="border px-12 py-2" colSpan={2}>
                CONFIG.
              </th>
            </tr>
          </thead>
          <tbody>
            {data.result.map((ticket: any) => (
              <tr className="text-center" key={ticket.id}>
                <td className="border p-2">{ticket.id}</td>
                <td className="border p-2">
                  {new Date(ticket.data).toLocaleDateString()}
                </td>
                <td className="border p-2">{ticket.semana}</td>
                <td className="border p-2">{ticket.ticket}</td>
                <td className="border p-2">{ticket.codigo}</td>
                <td className="border p-2">{ticket.status}</td>
                <td className="border p-2">{ticket.tipo}</td>
                <td className="border p-2">{ticket.link}</td>
                <td className="border p-2 bg-blue-500 cursor-pointer">
                  <button
                    onClick={() => handleEditTicket(ticket)}
                    type="button"
                    className="cursor-pointer"
                  >
                    editar
                  </button>
                </td>
                <td className="border p-2 bg-red-400 cursor-pointer">
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    type="button"
                    className="cursor-pointer"
                  >
                    deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Home;
