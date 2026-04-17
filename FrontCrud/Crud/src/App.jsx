import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const API_URL = "http://localhost:8080/tutorials";

  const [tutorials, setTutorials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [currentId, setCurrentId] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  // GET
  const fetchTutorials = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTutorials(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  // DELETE ONE
  const deleteTutorial = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTutorials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTutorial = async () => {
    if (!updateTitle || !updateDescription) return;

    try {
      const res = await fetch(`${API_URL}/${currentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: updateTitle,
          description: updateDescription
        })
      });

      if (!res.ok) {
        console.error("Erreur UPDATE");
        return;
      }


      // update local
      setTutorials(prev =>
        prev.map(t =>
          t.id === currentId
            ? { ...t, title: updateTitle, description: updateDescription }
            : t
        )
      );

      setShowUpdate(false);

    } catch (err) {
      console.error(err);
    }
  };
  const deleteAll = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erreur DELETE ALL:", text);
        return;
      }

      setTutorials([]);

    } catch (err) {
      console.error(err);
    }
  };
  // CREATE
  const handleSubmit = async () => {
    if (!title || !description) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();
      setTutorials(prev => [...prev, data]);

      setTitle("");
      setDescription("");
      setShowForm(false);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="site">
      <div className="btns">
        <h1 className="gauche">Liste de films et séries</h1>
        <div className="boutonsPP">
          <button className="btnss ml" onClick={() => setShowForm(true)}>&#43;</button>
          <button className="btnss" onClick={deleteAll}> &#8635; </button>  
        </div>
      </div>


      <div className="table gauche">
        <div className="entete">
          <div className="tr">
            <div className="th">ID</div>
            <div className="th">Titre</div>
            <div className="th">Description</div>
          </div>
        </div>
        <div className="corps">
          {tutorials.map((tutorial) => (
          <div className="tr"key={tutorial.id}>
            <div className="td">{tutorial.id}</div>
            <div className="td">{tutorial.title}</div>
            <div className="td">{tutorial.description}</div>
            <button className="btnTableau" onClick={() => {
              setCurrentId(tutorial.id);
              setUpdateTitle(tutorial.title);
              setUpdateDescription(tutorial.description);
              setShowUpdate(true);
                }}>
                  &#9998;
                </button>

                <button className="btnTableau" onClick={() => deleteTutorial(tutorial.id)}>
                  ✖
                </button>
          </div>
          ))}
        </div>
      <div>


        </div>
      </div>
      
      {showForm && (
        <div className="overlay">
        <div className="contenus">
          <h3 className="gauche">Film</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <h3 className="gauche">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <div>
            <button className="btnss ml" onClick={() => setShowForm(false)}>✖</button> 
           <button className="btnss" onClick={handleSubmit}>✔</button>
          </div>
          
        </div>
        </div>
      )}

      {showUpdate && (
        <div className="overlay">
          <div className="contenus">
            <h3 className="gauche">Film</h3>
            <input
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <h3 className="gauche">Description</h3>
            <textarea
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
            />
            <div>
              <button className="btnss ml" onClick={() => setShowUpdate(false)}>✖</button>
              <button className="btnss" onClick={updateTutorial}>✔</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;