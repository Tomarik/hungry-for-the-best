import { createTrivia } from "../services/trivia.ts";
import type { CreateTriviaInput } from "../types/trivia.ts";

const seedQuestions: CreateTriviaInput[] = [
  // --- Easy / Geography ---
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Pacific Ocean"],
    difficulty: "easy",
    tags: ["geography"],
  },
  {
    question: "What is the capital of France?",
    answers: ["Paris"],
    difficulty: "easy",
    tags: ["geography"],
  },
  {
    question: "What continent is Brazil located on?",
    answers: ["South America"],
    difficulty: "easy",
    tags: ["geography"],
  },
  {
    question: "What is the longest river in the world?",
    answers: ["Nile", "Amazon"],
    difficulty: "easy",
    tags: ["geography"],
  },
  {
    question: "How many continents are there?",
    answers: ["7"],
    difficulty: "easy",
    tags: ["geography"],
  },

  // --- Easy / History ---
  {
    question: "In what year did World War II end?",
    answers: ["1945"],
    difficulty: "easy",
    tags: ["history"],
  },
  {
    question: "Who was the first President of the United States?",
    answers: ["George Washington"],
    difficulty: "easy",
    tags: ["history"],
  },
  {
    question: "What ancient civilization built the pyramids at Giza?",
    answers: ["Egyptians", "Ancient Egypt"],
    difficulty: "easy",
    tags: ["history"],
  },
  {
    question: "What ship sank on its maiden voyage in 1912?",
    answers: ["Titanic", "RMS Titanic"],
    difficulty: "easy",
    tags: ["history"],
  },
  {
    question: "What wall divided Berlin from 1961 to 1989?",
    answers: ["Berlin Wall"],
    difficulty: "easy",
    tags: ["history"],
  },

  // --- Easy / Science ---
  {
    question: "What planet is closest to the Sun?",
    answers: ["Mercury"],
    difficulty: "easy",
    tags: ["science"],
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    answers: ["Carbon dioxide", "CO2"],
    difficulty: "easy",
    tags: ["science"],
  },
  {
    question: "How many bones are in the adult human body?",
    answers: ["206"],
    difficulty: "easy",
    tags: ["science"],
  },
  {
    question: "What is the chemical symbol for water?",
    answers: ["H2O"],
    difficulty: "easy",
    tags: ["science"],
  },
  {
    question: "What force keeps us on the ground?",
    answers: ["Gravity"],
    difficulty: "easy",
    tags: ["science"],
  },

  // --- Easy / Pop Culture ---
  {
    question: "What wizard school does Harry Potter attend?",
    answers: ["Hogwarts"],
    difficulty: "easy",
    tags: ["pop_culture"],
  },
  {
    question: "What is the name of the Disney princess who lost her glass slipper?",
    answers: ["Cinderella"],
    difficulty: "easy",
    tags: ["pop_culture"],
  },
  {
    question: "What band was John Lennon a member of?",
    answers: ["The Beatles"],
    difficulty: "easy",
    tags: ["pop_culture"],
  },
  {
    question: "In what fictional city does Batman operate?",
    answers: ["Gotham", "Gotham City"],
    difficulty: "easy",
    tags: ["pop_culture"],
  },
  {
    question: "What movie features the quote 'I see dead people'?",
    answers: ["The Sixth Sense"],
    difficulty: "easy",
    tags: ["pop_culture"],
  },

  // --- Medium / Geography ---
  {
    question: "What is the smallest country in the world by area?",
    answers: ["Vatican City"],
    difficulty: "medium",
    tags: ["geography"],
  },
  {
    question: "What country has the most natural lakes?",
    answers: ["Canada"],
    difficulty: "medium",
    tags: ["geography"],
  },
  {
    question: "What is the driest continent on Earth?",
    answers: ["Antarctica"],
    difficulty: "medium",
    tags: ["geography"],
  },
  {
    question: "What strait separates Europe from Africa?",
    answers: ["Strait of Gibraltar"],
    difficulty: "medium",
    tags: ["geography"],
  },
  {
    question: "What is the capital of New Zealand?",
    answers: ["Wellington"],
    difficulty: "medium",
    tags: ["geography"],
  },

  // --- Medium / History ---
  {
    question: "What year did the French Revolution begin?",
    answers: ["1789"],
    difficulty: "medium",
    tags: ["history"],
  },
  {
    question: "Who was the first woman to fly solo across the Atlantic?",
    answers: ["Amelia Earhart"],
    difficulty: "medium",
    tags: ["history"],
  },
  {
    question: "What empire was ruled by Genghis Khan?",
    answers: ["Mongol Empire"],
    difficulty: "medium",
    tags: ["history"],
  },
  {
    question: "In what year did the United States purchase Alaska from Russia?",
    answers: ["1867"],
    difficulty: "medium",
    tags: ["history"],
  },
  {
    question: "What was the name of the first artificial satellite launched into space?",
    answers: ["Sputnik", "Sputnik 1"],
    difficulty: "medium",
    tags: ["history", "science"],
  },

  // --- Medium / Science ---
  {
    question: "What is the hardest natural substance on Earth?",
    answers: ["Diamond"],
    difficulty: "medium",
    tags: ["science"],
  },
  {
    question: "What organ in the human body produces insulin?",
    answers: ["Pancreas"],
    difficulty: "medium",
    tags: ["science"],
  },
  {
    question: "What is the speed of light in miles per second, approximately?",
    answers: ["186,000"],
    difficulty: "medium",
    tags: ["science"],
  },
  {
    question: "What element does the chemical symbol 'Au' represent?",
    answers: ["Gold"],
    difficulty: "medium",
    tags: ["science"],
  },
  {
    question: "How many chromosomes do humans have?",
    answers: ["46"],
    difficulty: "medium",
    tags: ["science"],
  },

  // --- Medium / Pop Culture ---
  {
    question: "What actor played Jack Dawson in Titanic?",
    answers: ["Leonardo DiCaprio"],
    difficulty: "medium",
    tags: ["pop_culture"],
  },
  {
    question: "What TV show takes place in the fictional town of Hawkins, Indiana?",
    answers: ["Stranger Things"],
    difficulty: "medium",
    tags: ["pop_culture"],
  },
  {
    question: "What video game franchise features a character named Master Chief?",
    answers: ["Halo"],
    difficulty: "medium",
    tags: ["pop_culture"],
  },
  {
    question: "What is the highest-grossing film of all time (not adjusted for inflation)?",
    answers: ["Avatar"],
    difficulty: "medium",
    tags: ["pop_culture"],
  },
  {
    question: "What band released the album 'Nevermind' in 1991?",
    answers: ["Nirvana"],
    difficulty: "medium",
    tags: ["pop_culture"],
  },

  // --- Hard / Geography ---
  {
    question: "What is the only country that borders both the Caspian Sea and the Persian Gulf?",
    answers: ["Iran"],
    difficulty: "hard",
    tags: ["geography"],
  },
  {
    question: "What African country was formerly known as Abyssinia?",
    answers: ["Ethiopia"],
    difficulty: "hard",
    tags: ["geography"],
  },
  {
    question: "What is the deepest point in the ocean?",
    answers: ["Challenger Deep", "Mariana Trench"],
    difficulty: "hard",
    tags: ["geography"],
  },
  {
    question: "What is the only US state that shares a border with only one other state?",
    answers: ["Maine"],
    difficulty: "hard",
    tags: ["geography"],
  },
  {
    question: "What country has the longest coastline in the world?",
    answers: ["Canada"],
    difficulty: "hard",
    tags: ["geography"],
  },

  // --- Hard / History ---
  {
    question: "In what year was the Magna Carta signed?",
    answers: ["1215"],
    difficulty: "hard",
    tags: ["history"],
  },
  {
    question: "What treaty ended World War I?",
    answers: ["Treaty of Versailles"],
    difficulty: "hard",
    tags: ["history"],
  },
  {
    question: "Who was the last pharaoh of Ancient Egypt?",
    answers: ["Cleopatra", "Cleopatra VII"],
    difficulty: "hard",
    tags: ["history"],
  },
  {
    question: "What was the shortest war in recorded history, lasting approximately 38-45 minutes?",
    answers: ["Anglo-Zanzibar War"],
    difficulty: "hard",
    tags: ["history"],
  },
  {
    question: "What Roman Emperor made Christianity the official religion of the Roman Empire?",
    answers: ["Theodosius I", "Theodosius"],
    difficulty: "hard",
    tags: ["history"],
  },

  // --- Hard / Science ---
  {
    question: "What is the most abundant element in the universe?",
    answers: ["Hydrogen"],
    difficulty: "hard",
    tags: ["science"],
  },
  {
    question: "What particle is known as the 'God particle'?",
    answers: ["Higgs boson"],
    difficulty: "hard",
    tags: ["science"],
  },
  {
    question: "What is the rarest blood type in humans?",
    answers: ["AB negative", "AB-"],
    difficulty: "hard",
    tags: ["science"],
  },
  {
    question: "What is the only letter that does not appear on the periodic table?",
    answers: ["J"],
    difficulty: "hard",
    tags: ["science"],
  },
  {
    question: "What is the term for the study of fungi?",
    answers: ["Mycology"],
    difficulty: "hard",
    tags: ["science"],
  },

  // --- Hard / Pop Culture ---
  {
    question: "What was the first feature-length animated film ever released?",
    answers: ["El Apóstol", "The Apostle"],
    difficulty: "hard",
    tags: ["pop_culture", "history"],
  },
  {
    question: "What actor has been nominated for the most Academy Awards without winning?",
    answers: ["Peter O'Toole"],
    difficulty: "hard",
    tags: ["pop_culture"],
  },
  {
    question: "What was the first video game to be played in outer space?",
    answers: ["Tetris"],
    difficulty: "hard",
    tags: ["pop_culture", "science"],
  },
  {
    question: "What 1982 film was the first to feature entirely computer-generated sequences?",
    answers: ["Tron"],
    difficulty: "hard",
    tags: ["pop_culture"],
  },
  {
    question: "What artist holds the record for the most weeks at number one on the Billboard Hot 100 with a single song?",
    answers: ["Lil Nas X"],
    difficulty: "hard",
    tags: ["pop_culture"],
  },
];

// --- Run the seed ---
console.log("🌱 Seeding trivia questions...\n");

let created = 0;
let failed = 0;

for (const input of seedQuestions) {
  try {
    const question = await createTrivia(input);
    console.log(`  ✅ [${question.difficulty}] ${question.question}`);
    created++;
  } catch (error) {
    console.error(`  ❌ Failed: ${input.question} — ${error}`);
    failed++;
  }
}

console.log(`\n🌱 Seeding complete: ${created} created, ${failed} failed`);
console.log(`   Total questions in database: ${created}`);

Deno.exit(0);
