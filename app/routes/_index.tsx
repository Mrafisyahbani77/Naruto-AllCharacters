import type { MetaFunction } from "@remix-run/node";
import axios from "axios";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Naruto AllCharacters" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 20;

  const fetchAllCharacters = async () => {
    try {
      const response = await axios.get("https://narutodb.xyz/api/character?page=1&limit=1");
      const totalCharacters = response.data.totalCharacters;
      const totalPages = Math.ceil(totalCharacters / charactersPerPage);
      const allCharactersData = [];

      for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(`https://narutodb.xyz/api/character?page=${page}&limit=${charactersPerPage}`);
        allCharactersData.push(...response.data.characters);
      }

      setAllCharacters(allCharactersData);
      setDisplayedCharacters(allCharactersData.slice(0, charactersPerPage));
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setDisplayedCharacters(allCharacters.slice((newPage - 1) * charactersPerPage, newPage * charactersPerPage));
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(allCharacters.length / charactersPerPage)) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setDisplayedCharacters(allCharacters.slice((newPage - 1) * charactersPerPage, newPage * charactersPerPage));
    }
  };

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl mb-4 text-center font-semibold">Welcome to Naruto All Characters</h1>
      <div className="flex flex-wrap gap-4 justify-between">
        {displayedCharacters.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {displayedCharacters.map((character) => (
              <div key={character.id} className="bg-white shadow-md rounded p-4 flex flex-col space-y-4 w-72">
                <div className="flex items-center space-x-4">
                  <img
                    src={character.images?.[0]} // Assuming the character has an array of images
                    alt={character.name}
                    className="w-20 h-20 object-cover"
                  />
                  <span className="text-lg font-semibold">{character.name}</span>
                </div>
                <div className="text-sm">
                  <p><strong>Debut:</strong></p>
                  <p>Manga: {character.debut?.manga}</p>
                  <p>Anime: {character.debut?.anime}</p>
                  <p>Appears In: {character.debut?.appearsIn}</p>
                </div>
                <div className="text-sm">
                  <p><strong>Personal:</strong></p>
                  <p>Sex: {character.personal?.sex}</p>
                  <p>Age (Part I): {character.personal?.age?.["Part I"]}</p>
                  <p>Affiliation: {character.personal?.affiliation}</p>
                </div>
                <div className="text-sm">
                  <p><strong>Rank:</strong></p>
                  <p>Ninja Rank (Part I): {character.rank?.ninjaRank?.["Part I"]}</p>
                </div>
                <div className="text-sm">
                  <p><strong>Voice Actors:</strong></p>
                  <p>English: {character.voiceActors?.english}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading characters...</p>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(allCharacters.length / charactersPerPage)}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(allCharacters.length / charactersPerPage)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
