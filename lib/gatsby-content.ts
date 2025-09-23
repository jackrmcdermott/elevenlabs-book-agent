export interface BookContent {
  title: string
  author: string
  chapters: Chapter[]
}

export interface Chapter {
  id: number
  title: string
  content: (Paragraph | Table | Header)[]
}

export interface Paragraph {
  type: "paragraph"
  text: string
  className?: string
}

export interface Table {
  type: "table"
  rows: TableRow[]
}

export interface TableRow {
  cells: TableCell[]
}

export interface TableCell {
  text: string
  className?: string
}

export interface Header {
  type: "header"
  level: number
  text: string
}

export const gatsbyContent: BookContent = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  chapters: [
    {
      id: 1,
      title: "Chapter I",
      content: [
        { type: "header", level: 2, text: "Chapter I" },
        {
          type: "paragraph",
          text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.",
        },
        {
          type: "paragraph",
          text: '"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."',
        },
        {
          type: "paragraph",
          text: "He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.",
        },
        {
          type: "table",
          rows: [
            { cells: [{ text: "Rise from bed" }, { text: "6:00" }, { text: "a.m.", className: "right" }] },
            {
              cells: [
                { text: "Dumbell exercise and wall-scaling" },
                { text: "6:15⁠–⁠6:30" },
                { text: '"', className: "right" },
              ],
            },
            { cells: [{ text: "Study electricity, etc." }, { text: "7:15⁠–⁠8:15" }, { text: '"', className: "right" }] },
            { cells: [{ text: "Work" }, { text: "8:30⁠–⁠4:30" }, { text: "p.m.", className: "right" }] },
            { cells: [{ text: "Baseball and sports" }, { text: "4:30⁠–⁠5:00" }, { text: '"', className: "right" }] },
            {
              cells: [
                { text: "Practise elocution, poise and how to attain it" },
                { text: "5:00⁠–⁠6:00" },
                { text: '"', className: "right" },
              ],
            },
            { cells: [{ text: "Study needed inventions" }, { text: "7:00⁠–⁠9:00" }, { text: '"', className: "right" }] },
          ],
        },
        {
          type: "paragraph",
          text: "The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.",
        },
        {
          type: "paragraph",
          text: "Most of the big shore places were closed now and there were hardly any lights except the shadowy, moving glow of a ferryboat across the Sound. And as the moon rose higher the inessential houses began to melt away until gradually I became aware of the old island here that flowered once for Dutch sailors' eyes—a fresh, green breast of the new world.",
        },
        {
          type: "paragraph",
          text: "Its vanished trees, the trees that had made way for Gatsby's house, had once pandered in whispers to the last and greatest of all human dreams; for a transitory enchanted moment man must have held his breath in the presence of this continent, compelled into an aesthetic contemplation he neither understood nor desired, face to face for the last time in history with something commensurate to his capacity for wonder.",
        },
        {
          type: "paragraph",
          text: "And as I sat there brooding on the old, unknown world, I thought of Gatsby's wonder when he first picked out the green light at the end of Daisy's dock. He had come a long way to this blue lawn, and his dream must have seemed so close that he could hardly fail to grasp it.",
        },
        {
          type: "paragraph",
          text: "He did not know that it was already behind him, somewhere back in that vast obscurity beyond the city, where the dark fields of the republic rolled on under the night.",
        },
        { type: "paragraph", text: "So we beat on, boats against the current, borne back ceaselessly into the past." },
      ],
    },
    {
      id: 2,
      title: "Chapter II",
      content: [
        { type: "header", level: 2, text: "Chapter II" },
        {
          type: "paragraph",
          text: "About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land.",
        },
        {
          type: "paragraph",
          text: "This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens; where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air.",
        },
        {
          type: "paragraph",
          text: "Occasionally a line of gray cars crawls along an invisible track, gives out a ghastly creak, and comes to rest, and immediately the ash-gray men swarm up with leaden spades and stir up an impenetrable cloud, which screens their obscure operations from your sight.",
        },
        {
          type: "paragraph",
          text: "But above the gray land and the spasms of bleak dust which drift endlessly over it, you perceive, after a moment, the eyes of Doctor T. J. Eckleburg.",
        },
        {
          type: "paragraph",
          text: "The eyes of Doctor T. J. Eckleburg are blue and gigantic—their irises are one yard high. They look out of no face, but, instead, from a pair of enormous yellow spectacles which pass over a nonexistent nose.",
        },
        {
          type: "paragraph",
          text: "Evidently some wild wag of an oculist set them there to fatten his practice in the borough of Queens, and then sank down himself into eternal blindness, or forgot them and moved away.",
        },
        {
          type: "paragraph",
          text: "But his eyes, dimmed a little by many paintless days, under sun and rain, brood on over the solemn dumping ground.",
        },
        {
          type: "paragraph",
          text: "The valley of ashes is bounded on one side by a small foul river, and, when the drawbridge is up to let barges through, the passengers on waiting trains can stare at the dismal scene for as long as half an hour.",
        },
      ],
    },
    {
      id: 3,
      title: "Chapter III",
      content: [
        { type: "header", level: 2, text: "Chapter III" },
        {
          type: "paragraph",
          text: "There was music from my neighbor's house through the summer nights. In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars.",
        },
        {
          type: "paragraph",
          text: "At high tide in the afternoon I watched his guests diving from the tower of his raft, or taking the sun on the hot sand of his beach while his two motor-boats slit the waters of the Sound, drawing aquaplanes over cataracts of foam.",
        },
        {
          type: "paragraph",
          text: "On week-ends his Rolls-Royce became an omnibus, bearing parties to and from the city between nine in the morning and long past midnight, while his station wagon scampered like a brisk yellow bug to meet all trains.",
        },
        {
          type: "paragraph",
          text: "And on Mondays eight servants, including an extra gardener, toiled all day with mops and scrubbing-brushes and hammers and garden-shears, repairing the ravages of the night before.",
        },
      ],
    },
    {
      id: 4,
      title: "Chapter IV",
      content: [
        { type: "header", level: 2, text: "Chapter IV" },
        {
          type: "paragraph",
          text: "On Sunday morning while church bells rang in the villages alongshore, the world and its mistress returned to Gatsby's house and twinkled hilariously on his lawn.",
        },
        {
          type: "paragraph",
          text: '"He\'s a bootlegger," said the young ladies, moving somewhere between his cocktails and his flowers. "One time he killed a man who had found out that he was nephew to Von Hindenburg and second cousin to the devil."',
        },
        { type: "paragraph", text: "Reach me a rose, honey, and pour me a last drop into that there crystal glass." },
        {
          type: "paragraph",
          text: 'Once I wrote down on the empty spaces of a time-table the names of those who came to Gatsby\'s house that summer. It is an old time-table now, disintegrating at its folds, and headed "This schedule in effect July 5th, 1922."',
        },
      ],
    },
    {
      id: 5,
      title: "Chapter V",
      content: [
        { type: "header", level: 2, text: "Chapter V" },
        {
          type: "paragraph",
          text: "When I came home to West Egg that night I was afraid for a moment that my house was on fire. Two o'clock and the whole corner of the peninsula was blazing with light, which fell unreal on the shrubbery and made thin elongating glints upon the roadside wires.",
        },
        { type: "paragraph", text: "Turning a corner, I saw that it was Gatsby's house, lit from tower to cellar." },
        {
          type: "paragraph",
          text: 'At first I thought it was another party, a wild rout that had resolved itself into "hide-and-go-seek" or "sardines-in-the-box" with all the house thrown open to the game.',
        },
        {
          type: "paragraph",
          text: "But there wasn't a sound. Only wind in the trees, which blew the wires and made the lights go off and on again as if the house had winked into the darkness.",
        },
      ],
    },
    {
      id: 6,
      title: "Chapter VI",
      content: [
        { type: "header", level: 2, text: "Chapter VI" },
        {
          type: "paragraph",
          text: "About this time an ambitious young reporter from New York arrived one morning at Gatsby's door and asked him if he had anything to say.",
        },
        { type: "paragraph", text: '"Anything to say about what?" inquired Gatsby politely.' },
        { type: "paragraph", text: '"Why—any statement to give out."' },
        {
          type: "paragraph",
          text: "It was a random shot, and yet the reporter's instinct was right. Gatsby's notoriety, spread about by the hundreds who had accepted his hospitality and so become authorities upon his past, had increased all summer until he fell just short of being news.",
        },
      ],
    },
    {
      id: 7,
      title: "Chapter VII",
      content: [
        { type: "header", level: 2, text: "Chapter VII" },
        {
          type: "paragraph",
          text: "It was when curiosity about Gatsby was at its highest that the lights in his house failed to go on one Saturday night—and, as obscurely as it had begun, his career as Trimalchio was over.",
        },
        {
          type: "paragraph",
          text: "Only gradually did I become aware that the automobiles which turned expectantly into his drive stayed for just a minute and then drove sulkily away.",
        },
        {
          type: "paragraph",
          text: "Wondering if he were sick I went over to find out—an unfamiliar butler with a villainous face squinted at me suspiciously from the door.",
        },
        { type: "paragraph", text: '"Is Mr. Gatsby sick?"' },
        { type: "paragraph", text: '"Nope." After a pause he added "sir" in a dilatory, grudging way.' },
      ],
    },
    {
      id: 8,
      title: "Chapter VIII",
      content: [
        { type: "header", level: 2, text: "Chapter VIII" },
        {
          type: "paragraph",
          text: "I couldn't sleep all night; a fog-horn was groaning incessantly on the Sound, and I tossed half-sick between grotesque reality and savage, frightening dreams.",
        },
        {
          type: "paragraph",
          text: "Toward dawn I heard a taxi go up Gatsby's drive, and immediately I jumped out of bed and began to dress—I felt that I had something to tell him, something to warn him about, and morning would be too late.",
        },
        {
          type: "paragraph",
          text: "Crossing his lawn, I saw that his front door was still open and he was leaning against a table in the hall, heavy with dejection or sleep.",
        },
        {
          type: "paragraph",
          text: '"Nothing happened," he said wanly. "I waited, and about four o\'clock she came to the window and stood there for a minute and then turned out the light."',
        },
      ],
    },
    {
      id: 9,
      title: "Chapter IX",
      content: [
        { type: "header", level: 2, text: "Chapter IX" },
        {
          type: "paragraph",
          text: "After two years I remember the rest of that day, and that night and the next day, only as an endless drill of police and photographers and newspaper men in and out of Gatsby's front door.",
        },
        {
          type: "paragraph",
          text: "A rope stretched across the main gate and a policeman by it kept out the curious, but little boys soon discovered that they could enter through my yard, and there were always a few of them clustered open-mouthed about the pool.",
        },
        {
          type: "paragraph",
          text: 'Someone with a positive manner, perhaps a detective, used the expression "madman" as he bent over Wilson\'s body that afternoon, and the adventitious authority of his voice set the key for the newspaper reports next morning.',
        },
        {
          type: "paragraph",
          text: "Most of the big shore places were closed now and there were hardly any lights except the shadowy, moving glow of a ferryboat across the Sound. And as the moon rose higher the inessential houses began to melt away until gradually I became aware of the old island here that flowered once for Dutch sailors' eyes—a fresh, green breast of the new world.",
        },
        {
          type: "paragraph",
          text: "Its vanished trees, the trees that had made way for Gatsby's house, had once pandered in whispers to the last and greatest of all human dreams; for a transitory enchanted moment man must have held his breath in the presence of this continent, compelled into an aesthetic contemplation he neither understood nor desired, face to face for the last time in history with something commensurate to his capacity for wonder.",
        },
        {
          type: "paragraph",
          text: "And as I sat there brooding on the old, unknown world, I thought of Gatsby's wonder when he first picked out the green light at the end of Daisy's dock. He had come a long way to this blue lawn, and his dream must have seemed so close that he could hardly fail to grasp it.",
        },
        {
          type: "paragraph",
          text: "He did not know that it was already behind him, somewhere back in that vast obscurity beyond the city, where the dark fields of the republic rolled on under the night.",
        },
        { type: "paragraph", text: "So we beat on, boats against the current, borne back ceaselessly into the past." },
      ],
    },
  ],
}
