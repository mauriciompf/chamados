"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { create, deleteTicket } from "./create";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Ticket {
  id: number;
  ticket: string;
  data: string;
  codigo: string;
  status: string;
  tipo: string;
  semana?: string;
  link?: string;
}

function Home() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticket, setTicket] = useState("");
  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState("desenvolvimento");
  const [tipo, setTipo] = useState("padrao");
  const [editingTicket, setEditingTicket] = useState<null | Ticket>(null);
  const [calendarModal, setCalendarModal] = useState(false);

  const queryClient = useQueryClient();

  const formattedDate = selectDate.toISOString().split("T")[0];

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setTicket(ticket.ticket);
    setSelectDate(ticket.data ? new Date(ticket.data) : new Date());
    setCodigo(ticket.codigo);
    setStatus(ticket.status);
    setTipo(ticket.tipo);
    setIsTicketModalOpen(true);
  };

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

  const handleTicket = (e: ChangeEvent<HTMLInputElement>) => {
    setTicket(e.target.value);
  };

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

      // Reset form
      setTicket("");
      setSelectDate(new Date());
      setCodigo("");
      setStatus("desenvolvimento");
      setTipo("padrao");
      setEditingTicket(null);
      setIsTicketModalOpen(false);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const fetchTickets = async (): Promise<{ result: Ticket[] }> => {
    const { data } = await axios.get("http://localhost:3000/pages/api");
    return data;
  };

  const { data, error, isError, isLoading } = useQuery("tickets", fetchTickets);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error! {(error as Error).message}</div>;

  return (
    <main>
      <div className="grid place-items-center">
        {/* MODAL */}
        {isTicketModalOpen && (
          <form
            onSubmit={handleOnSubmit}
            className="pt-10 grid gap-y-1 w-[600px] h-[400px] bg-amber-50 text-black rounded-xl p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            {editingTicket && (
              <input type="hidden" name="id" value={editingTicket.id} />
            )}
            <button
              onClick={() => setIsTicketModalOpen(false)}
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
                  {selectDate.toLocaleDateString()}
                </button>

                {calendarModal && (
                  <Calendar
                    className="absolute bottom-70 left-50 z-10 bg-white p-2 rounded shadow-lg"
                    onChange={(date) => {
                      setSelectDate(date as Date);
                      setCalendarModal(false);
                    }}
                    value={selectDate}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="ticket" className="mr-2">
                  <strong>Ticket</strong>:
                </label>
                <input
                  type="text"
                  name="ticket"
                  value={ticket}
                  onChange={handleTicket}
                  className="border-b"
                  required
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="tipo" className="mr-4">
                  <strong>Tipo</strong>:
                </label>
                <select
                  className="border"
                  name="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="padrao">Padrão</option>
                  <option value="plano_de_aula">Plano de Aula</option>
                  <option value="pos">Pós Graduação</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="codigo" className="mr-2">
                  <strong>Código</strong>:
                </label>
                <input
                  name="codigo"
                  className="border-b"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="status" className="mr-4">
                  <strong>STATUS</strong>:
                </label>
                <select
                  className="border"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ativa">Ativa</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="desenvolvimento">Desenvolvimento</option>
                  <option value="pendente">Pendente</option>
                  <option value="salvo_local">Salvo Local</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer bg-gray-500 text-white rounded-2xl font-bold text-xl py-2 mt-4"
            >
              {editingTicket ? "Atualizar" : "Adicionar"}
            </button>
          </form>
        )}

        <h3 className="text-3xl font-bold text-center mt-14">
          Tabela de Solicitações de Chamados de Alterações
        </h3>
        <button
          type="button"
          onClick={() => setIsTicketModalOpen(true)}
          className="cursor-pointer mt-12 bg-white p-4 font-bold text-black text-xl rounded-3xl hover:bg-gray-100 transition-colors"
        >
          Adicionar nova solicitação
        </button>

        <div className="mt-12 overflow-x-auto text-black w-full max-w-6xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2">ID</th>
                <th className="border px-4 py-2">DATA</th>
                <th className="border px-2 py-2">SEMANA</th>
                <th className="border px-12 py-2">TICKET</th>
                <th className="border px-6 py-2">CÓDIGO</th>
                <th className="border px-10 py-2">STATUS</th>
                <th className="border px-6 py-2">TIPO</th>
                <th className="border px-12 py-2" colSpan={2}>
                  CONFIG.
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data?.result.map((ticket: Ticket) => (
                <tr key={ticket.id} className="bg-gray-50 hover:bg-gray-300">
                  <td className="border p-2">{ticket.id}</td>
                  <td className="border p-2">
                    {new Date(ticket.data).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{ticket.semana || "-"}</td>
                  <td className="border p-2">{ticket.ticket}</td>
                  <td className="border p-2">{ticket.codigo || "-"}</td>
                  <td className="border p-2 capitalize">{ticket.status}</td>
                  <td className="border p-2">
                    {ticket.tipo === "plano_de_aula"
                      ? "Plano de Aula"
                      : ticket.tipo === "pos"
                      ? "Pós Graduação"
                      : "Padrão"}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      type="button"
                      className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      type="button"
                      className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Home;
