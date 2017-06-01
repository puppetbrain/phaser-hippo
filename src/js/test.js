function showAnimal(name, age) {
  console.log(`Your name is ${name} and age is ${age}`)
}

showAnimal('Jolie', 2)

showAnimal('Bum', 100)

var jolieBook = {
  'name': 'Jolie',
  'age': 10
}

var bumBook = {
  'name': 'Bum',
  'age': 100
}

var yukiBook = {
  'name': 'Yuki',
  'age': 1
}

// console.log(`Jolie name is ${bumBook.name}`)


var animals = []
animals.push(jolieBook)
animals.push(bumBook)
animals.push(yukiBook)



for (var i = 0; i < animals.length; i++) {
  console.log(`The name is ${animals[i].name} and age is ${animals[i].age}`)

  if (animals[i].age >= 100) {
    console.log(`${animals[i].name} is old`)
  }
  else {
    console.log(`${animals[i].name} is young`)
  }
}