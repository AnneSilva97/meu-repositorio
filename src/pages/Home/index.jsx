import { useState, useEffect } from "react"; // Importa os hooks useState e useEffect do React para gerenciar estados e efeitos colaterais no componente
import api from "../../api";
import "./styles.css";

function Home() {
    const [title, setTitle] = useState(''); // Declara um estado title para armazenar o título do livro. Que inicialmente está vazio.
    const [author, setAuthor] = useState(''); //Declara o estado Author para armazena o autor do livro
    const [books, setBooks] = useState([]); //Armazena a lista de livros, que se inicia com um rray vazio 

    const [editing, setEditing] = useState(null); // Para controlar a edição de um item

    useEffect(() => {  // Busca os livros ao montar o componente
        fetchBooks(); //Chama a função fetchBooks para buscar os livros
    }, []);

    // Função assíncrona para buscar livros
    const fetchBooks = async () => {
        try {
            const response = await api.get('/');  // Faz uma requisição GET para a API e espera a resposta
            setBooks(response.data); // Atualiza o estado 'books' com os dados recebidos da API 
        } catch (error) {
            console.error(`Error ao buscar dados: ${error}`); //trata possiveis erros que ocorram durante a requisição
        }
    };

    // Função para enviar novos dados ao banco
    async function handleSubmit(e) { 
        e.preventDefault(); //impede que a página recarregue 

        try {
            if (editing) {
                //Se estiver no modo de edição, faz uma requisição PUT para atualizar um item existente.

                await api.put(`updateItem/${editing.id}`, { // Envia uma requisição PUT com o ID do item a ser atualizado (title ou author)
                    title,
                    author,
                });
                setEditing(null); // Limpa a edição após atualizar 

            } else { 
                //Se não estiver editando, faz uma requisição POST para adicionar um novo item
                await api.post('/insertItem', { //envia uma requisição POST para adicionar um novo item
                    title,
                    author,
                });
            }

            setTitle(''); //limpa o campo de título após inserir ou atualizar
            setAuthor('');//limpa o campo de autor após inserir ou atualizar
            fetchBooks(); //Atualiza a lista de livros

        } catch (error) {
            console.error('Erro ao inserir/atualizar dados: ', error); 
        }
    }

    //Função para iniciar a edição de um item
    const handleEdit = (book) => {
        setTitle(book.title);
        setAuthor(book.author);
        setEditing(book); //Define o item que está sendo editado
    };

    // Função para excluir um item
    const handleDelete = async (id) => { 
        try {
            await api.delete(`/deleteItem/${id}`); //faz uma requisição DELETE para remover o livro com o ID especificado
            fetchBooks(); //atualiza a lista de livros após exclusão
        } catch (error) {
            console.error('Erro ao excluir dados: ', error);
        }
    };

    return (
        <div> {/*componente HTML/JSX que será renderizado na tela */}
            <h1>{editing ? 'Editar Item' : 'Inserir Novo Item'}</h1>
            <form onSubmit={handleSubmit}>  {/*formulário para inserção ou edição de um livro*/}
                <div>
                    <label>Título: </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> {/*atualiza o estado 'title' ao mudar o valor*/}
                </div>
                <div>
                    <label>Autor: </label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} /> {/*atualiza o estado 'author' ao mudar o valor*/} 
                </div>
                <button type="submit">{editing ? 'Atualizar' : 'Inserir'}</button>  {/* este botão serve para o envio do formulário, o texto muda com base no estado 'editing' */}
                {editing && <button type="button" onClick={() => setEditing(null)}>Cancelar</button>} {/* se o estado do 'editing' não for 'null' é exibido o botão "cancelar" */}
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
                    {books.map((book) => ( //cria uma linha para cada livro 
                        <tr key={book.id}> {/*cada linha contem uma chave única, o ID do livro*/}
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                <button onClick={() => handleEdit(book)}>Editar</button> {/* Botão que chama a função de editar o livro */}
                                <button onClick={() => handleDelete(book.id)}>Excluir</button> {/* Botão que chama a função de deletar o livro */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
 
export default Home; // exportando o componente 'Home' para que ele possa ser utilizado em outros arquivos 
