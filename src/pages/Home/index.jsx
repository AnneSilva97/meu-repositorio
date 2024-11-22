import { useState, useEffect } from "react";
import api from "../../api";
import "./styles.css";

function Home() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [books, setBooks] = useState([]);

    const [editing, setEditing] = useState(null); // Para controlar a edição de um item

    useEffect(() => {
        fetchBooks(); // Busca os livros ao montar o componente
    }, []);

    // Função para buscar livros
    const fetchBooks = async () => {
        try {
            const response = await api.get('/');
            setBooks(response.data);
        } catch (error) {
            console.error(`Error ao buscar dados: ${error}`);
        }
    };

    // Função para enviar novos dados ao banco
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editing) {
                // Atualiza um item existente

                await api.put(`updateItem/${editing.id}`, {
                    title,
                    author,
                });
                setEditing(null); // Limpa a edição após atualizar

            } else {
                // Adiciona um novo item
                await api.post('/insertItem', {
                    title,
                    author,
                });
            }

            setTitle('');
            setAuthor('');
            fetchBooks(); // Atualiza a lista de livros

        } catch (error) {
            console.error('Erro ao inserir/atualizar dados: ', error);
        }
    }

    // Função para iniciar a edição de um item
    const handleEdit = (book) => {
        setTitle(book.title);
        setAuthor(book.author);
        setEditing(book); // Define o item que está sendo editado
    };

    // Função para excluir um item
    const handleDelete = async (id) => {
        try {
            await api.delete(`/deleteItem/${id}`);
            fetchBooks(); // Atualiza a lista de livros após exclusão
        } catch (error) {
            console.error('Erro ao excluir dados: ', error);
        }
    };

    return (
        <div>
            <h1>{editing ? 'Editar Item' : 'Inserir Novo Item'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título: </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Autor: </label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <button type="submit">{editing ? 'Atualizar' : 'Inserir'}</button>
                {editing && <button type="button" onClick={() => setEditing(null)}>Cancelar</button>}
            </form>

            <h1>Tabela de Livros</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                <button onClick={() => handleEdit(book)}>Editar</button>
                                <button onClick={() => handleDelete(book.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;
