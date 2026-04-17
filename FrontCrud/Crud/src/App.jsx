import { useEffect, useState } from "react";

function App() {

  const API_URL = "http://localhost:8080/tutorials";

  const [tutorials, setTutorials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // GET
  const fetchTutorials = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        const text = await res.text();
        console.error("Erreur GET:", text);
        return;
      }

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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erreur DELETE:", text);
        return;
      }

      setTutorials(prev => prev.filter(t => t.id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const updateTutorial = async (id) => {
    const newTitle = prompt("Modifier le titre :");
    const newDescription = prompt("Modifier la description :");

    if (!newTitle || !newDescription) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erreur UPDATE:", text);
        return;
      }

      setTutorials(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, title: newTitle, description: newDescription }
            : t
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE ALL
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

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Réponse non JSON:", text);
        return;
      }

      if (!res.ok) {
        console.error("Erreur CREATE:", data);
        return;
      }

      console.log("DATA BACK:", data);

      setTutorials(prev => [...prev, data]);

      setTitle("");
      setDescription("");
      setShowForm(false);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Liste de films et séries</h1>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tutorials.map((tutorial) => (
            <tr key={tutorial.id}>
              <td>{tutorial.id}</td>
              <td>{tutorial.title}</td>
              <td>{tutorial.description}</td>
              <td>
                <button onClick={() => updateTutorial(tutorial.id)}>
                  Modifier
                </button>
                <button onClick={() => deleteTutorial(tutorial.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowForm(true)}>
        Ajouter
      </button>

      <button onClick={deleteAll}>
        Réinitialiser BDD
      </button>

      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <h2>Ajouter des films et des séries</h2>

          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <br />

          <button onClick={handleSubmit}>
            Valider
          </button>

          <button onClick={() => setShowForm(false)}>
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}

export default App;