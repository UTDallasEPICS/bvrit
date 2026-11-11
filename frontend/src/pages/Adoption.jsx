import { useEffect, useState } from "react";
import api from "../api/axios.js";

function Adoption() {
    const [pet, setPet] = useState([]);

    useEffect(() => {
        const fetchdata = async () => {
            const response = await api.get('/api/petdata');
            setPet(response.data);
        };
        fetchdata()


    }, []);
    const petCards = pet.map((p) => {
        return {
            id: p._id,
            name: p.name,
            age: p.age,
            vaccination: p.vaccinationStatus,
            image: p.imagePath
        };
    });
    const petJsx = petCards.map((p) => {
        return (
            <div key={p.id}>
                <h2>{p.name}</h2>
                <p>Age: {p.age}</p>
                <p>Vaccination: {p.vaccination ? "yes" : "No"}</p>
                <img src={p.image} alt={p.name} />
            </div>
        );
    })

    console.log(petCards);

    return (
        <>
            <h1 className="text-center">Adoption Page</h1>
            {petJsx}
        </>
    );
}

export default Adoption;