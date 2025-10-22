const plank = document.getElementById("plank");
const log = document.getElementById("log");
const leftWeightDisplay = document.getElementById("left-weight");
const rightWeightDisplay = document.getElementById("right-weight");
const angleDisplay = document.getElementById("angle");
const nextWeightDisplay = document.getElementById("next-weight");
const insideScreen = document.getElementById("inside-screen");

//querycSelector -> class

nextWeightDisplay.innerHTML = generateRandomWeight();

// TODO: put all objects into array.
// let objects = [];

function addWeightToSide(side, weight) {
  console.log(weight, "gelen", side);
  if (side === "right") {
    rightWeightDisplay.innerHTML =
      parseInt(rightWeightDisplay.textContent) + weight;
  } else {
    leftWeightDisplay.innerHTML =
      parseInt(rightWeightDisplay.textContent) + weight;
  }
}

function generateRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function handleClick(side, distance) {
  const weight = parseInt(nextWeightDisplay.textContent);
  addWeightToSide(side, weight);
  let randomWeight = generateRandomWeight();
  nextWeightDisplay.innerHTML = randomWeight;
}

function calculateTorque(distance, weight) {
  return distance * weight;
}

insideScreen.addEventListener("click", function (event) {
  // event.offsetX div'in sol kenarına uzaklığı pixel olarak veriyor
  // this.offsetWidth div'in toplam genişliğini veriyor
  console.log("2 kere");
  const centerPoint = this.offsetWidth / 2;
  const distance = event.offsetX;
  if (distance < centerPoint) {
    handleClick("left", centerPoint - distance);
  } else {
    handleClick("right", distance - centerPoint);
  }
});
