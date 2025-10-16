export type QuestionType = {
  text: string;
  options: string[];
  correct: number;
  emoji?: string;
};

export type TopicType = "reading" | "math" | "culture" | "geography";

export const questionsByTopic: Record<TopicType, QuestionType[]> = {
  reading: [
    {
      text: "What sound does 'CAT' start with?",
      options: ["C", "A", "T", "D"],
      correct: 0,
      emoji: "🐱"
    },
    {
      text: "Which word rhymes with 'sun'?",
      options: ["moon", "fun", "star", "sky"],
      correct: 1,
      emoji: "☀️"
    },
    {
      text: "How many letters are in 'BOOK'?",
      options: ["3", "4", "5", "6"],
      correct: 1,
      emoji: "📚"
    },
    {
      text: "What letter comes after 'M'?",
      options: ["L", "N", "O", "P"],
      correct: 1,
      emoji: "🔤"
    },
    {
      text: "Which word means the same as 'happy'?",
      options: ["sad", "joyful", "angry", "tired"],
      correct: 1,
      emoji: "😊"
    }
  ],
  math: [
    {
      text: "What is 2 + 3?",
      options: ["4", "5", "6", "7"],
      correct: 1,
      emoji: "➕"
    },
    {
      text: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      emoji: "🔺"
    },
    {
      text: "What is 10 - 4?",
      options: ["5", "6", "7", "8"],
      correct: 1,
      emoji: "➖"
    },
    {
      text: "Which number is bigger?",
      options: ["5", "8", "3", "6"],
      correct: 1,
      emoji: "🔢"
    },
    {
      text: "How many apples? 🍎🍎🍎",
      options: ["2", "3", "4", "5"],
      correct: 1,
      emoji: "🍎"
    }
  ],
  culture: [
    {
      text: "Which country's flag is this? 🇯🇵",
      options: ["China", "Japan", "South Korea", "Thailand"],
      correct: 1,
      emoji: "🇯🇵"
    },
    {
      text: "What do people eat with chopsticks?",
      options: ["Pizza", "Noodles", "Burger", "Sandwich"],
      correct: 1,
      emoji: "🥢"
    },
    {
      text: "Which is a traditional Mexican food?",
      options: ["Sushi", "Pasta", "Tacos", "Curry"],
      correct: 2,
      emoji: "🌮"
    },
    {
      text: "What instrument is this? 🎸",
      options: ["Piano", "Drum", "Guitar", "Flute"],
      correct: 2,
      emoji: "🎸"
    },
    {
      text: "Where is the Eiffel Tower?",
      options: ["London", "Paris", "Rome", "Madrid"],
      correct: 1,
      emoji: "🗼"
    }
  ],
  geography: [
    {
      text: "What is the biggest ocean?",
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      correct: 1,
      emoji: "🌊"
    },
    {
      text: "Which continent has penguins?",
      options: ["Africa", "Asia", "Antarctica", "Europe"],
      correct: 2,
      emoji: "🐧"
    },
    {
      text: "What color is grass?",
      options: ["Blue", "Green", "Yellow", "Red"],
      correct: 1,
      emoji: "🌱"
    },
    {
      text: "Where does the sun rise?",
      options: ["North", "South", "East", "West"],
      correct: 2,
      emoji: "🌅"
    },
    {
      text: "What is Earth's shape?",
      options: ["Flat", "Round", "Square", "Triangle"],
      correct: 1,
      emoji: "🌍"
    }
  ]
};
