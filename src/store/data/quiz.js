export default {
  demographics: {
    region: null,
    age: null,
    sex: null
  },
  q2: {
    questions: [
      {
        question: 'Koho byste volili?',
        answer: null,
        optional: false
      },
      {
        question: 'Kdo by byl vaše druhá volba?',
        answer: null,
        optional: true
      },
      {
        question: 'Kdyby vaše strana sestavovala koalici, které strany by za vás byly akceptovatelné?',
        answer: [],
        optional: true
      },
      {
        question: 'Kdyby vaše strana sestavovala koalici, které strany by naopak neměla do koalice přizvat?',
        answer: [],
        optional: true
      },
      {
        question: 'Jsou nějaké strany, u kterých si vyloženě přejete, aby se do krajského zastupitelstva nedostaly?',
        answer: [],
        optional: true
      }
    ]
  },
  q3: {
    questions: [
      {
        question: 'Koho byste si přáli za hejtmana či hejtmanku?',
        answer: [],
        optional: false
      },
      {
        question: 'Koho byste naopak nechtěli?',
        answer: null,
        optional: true
      },
      {
        question: 'Kdo se podle vás nakonec hejtmanem stane?',
        answer: null,
        optional: true
      }
    ]
  }
}
