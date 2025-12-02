import { TopicType } from "./questions";

export interface LessonContent {
  topic: TopicType;
  title: string;
  emoji: string;
  slides: LessonSlide[];
}

export interface LessonSlide {
  type: "intro" | "content" | "example" | "practice";
  title?: string;
  content: string;
  emoji?: string;
  examples?: string[];
  image?: string;
}

export const lessonsByTopic: Record<TopicType, LessonContent> = {
  reading: {
    topic: "reading",
    title: "Learning to Read",
    emoji: "📚",
    slides: [
      {
        type: "intro",
        title: "Welcome to Reading! 📚",
        content: "Let's learn about letters, sounds, and words together!",
        emoji: "🌟",
      },
      {
        type: "content",
        title: "Letter Sounds",
        content: "Every letter makes a special sound! For example, the letter 'C' makes the 'cuh' sound, like in 'CAT' 🐱",
        emoji: "🔤",
        examples: ["C says 'cuh' - CAT", "A says 'ah' - APPLE", "T says 'tuh' - TIGER"],
      },
      {
        type: "content",
        title: "Rhyming Words",
        content: "Words that sound the same at the end are called rhyming words!",
        emoji: "🎵",
        examples: ["SUN and FUN rhyme! ☀️", "CAT and HAT rhyme! 🐱", "DOG and LOG rhyme! 🐕"],
      },
      {
        type: "content",
        title: "Counting Letters",
        content: "Words are made of letters! Let's count them together.",
        emoji: "🔢",
        examples: ["BOOK has 4 letters: B-O-O-K", "CAT has 3 letters: C-A-T", "SUN has 3 letters: S-U-N"],
      },
      {
        type: "example",
        title: "Let's Practice!",
        content: "Can you find words that rhyme with 'sun'?",
        emoji: "✨",
      },
    ],
  },
  math: {
    topic: "math",
    title: "Fun with Numbers",
    emoji: "🔢",
    slides: [
      {
        type: "intro",
        title: "Welcome to Math! 🔢",
        content: "Numbers are everywhere! Let's learn to count and add together!",
        emoji: "🌟",
      },
      {
        type: "content",
        title: "Adding Numbers",
        content: "When we add, we put numbers together! 2 + 3 means 2 things plus 3 more things.",
        emoji: "➕",
        examples: ["2 + 3 = 5", "1 + 4 = 5", "3 + 2 = 5"],
      },
      {
        type: "content",
        title: "Shapes",
        content: "Shapes are all around us! A triangle has 3 sides, a square has 4 sides!",
        emoji: "🔺",
        examples: ["Triangle has 3 sides", "Square has 4 sides", "Circle is round"],
      },
      {
        type: "content",
        title: "Subtracting Numbers",
        content: "When we subtract, we take away! 10 - 4 means we start with 10 and take away 4.",
        emoji: "➖",
        examples: ["10 - 4 = 6", "8 - 3 = 5", "7 - 2 = 5"],
      },
      {
        type: "example",
        title: "Let's Practice!",
        content: "Can you count these apples? 🍎🍎🍎",
        emoji: "✨",
      },
    ],
  },
  culture: {
    topic: "culture",
    title: "World Cultures",
    emoji: "🌍",
    slides: [
      {
        type: "intro",
        title: "Welcome to Culture! 🌍",
        content: "Let's explore amazing places and traditions from around the world!",
        emoji: "🌟",
      },
      {
        type: "content",
        title: "Countries and Flags",
        content: "Every country has its own special flag! Japan's flag has a red circle on white 🇯🇵",
        emoji: "🇯🇵",
        examples: ["Japan 🇯🇵 - Red circle on white", "Mexico 🇲🇽 - Green, white, and red", "France 🇫🇷 - Blue, white, and red"],
      },
      {
        type: "content",
        title: "Food Around the World",
        content: "Different countries have different yummy foods! In Japan, people eat noodles with chopsticks!",
        emoji: "🥢",
        examples: ["Japan - Noodles with chopsticks 🥢", "Mexico - Tacos 🌮", "Italy - Pizza 🍕"],
      },
      {
        type: "content",
        title: "Famous Places",
        content: "The Eiffel Tower is a famous building in Paris, France! It's very tall and beautiful!",
        emoji: "🗼",
        examples: ["Eiffel Tower in Paris, France 🗼", "Big Ben in London, England 🕰️", "Pyramids in Egypt 🏺"],
      },
      {
        type: "example",
        title: "Let's Practice!",
        content: "Can you name a country that uses chopsticks?",
        emoji: "✨",
      },
    ],
  },
  geography: {
    topic: "geography",
    title: "Our Amazing Earth",
    emoji: "🌎",
    slides: [
      {
        type: "intro",
        title: "Welcome to Geography! 🌎",
        content: "Let's learn about our amazing planet Earth and all its wonderful places!",
        emoji: "🌟",
      },
      {
        type: "content",
        title: "Oceans",
        content: "Earth has 5 big oceans! The Pacific Ocean is the biggest ocean in the world!",
        emoji: "🌊",
        examples: ["Pacific Ocean - The biggest! 🌊", "Atlantic Ocean", "Indian Ocean"],
      },
      {
        type: "content",
        title: "Continents",
        content: "Continents are big pieces of land! Antarctica is very cold and has penguins!",
        emoji: "🐧",
        examples: ["Antarctica - Home of penguins! 🐧", "Africa - Has elephants 🐘", "Asia - The biggest continent"],
      },
      {
        type: "content",
        title: "Nature",
        content: "Grass is green, the sky is blue, and the sun rises in the East every morning!",
        emoji: "🌅",
        examples: ["Grass is green 🌱", "Sun rises in the East 🌅", "Earth is round like a ball 🌍"],
      },
      {
        type: "example",
        title: "Let's Practice!",
        content: "Can you name the biggest ocean?",
        emoji: "✨",
      },
    ],
  },
};



