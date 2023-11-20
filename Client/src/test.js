let nums = [2, 3, 4, 2, 6, 8, 11, 9, 9, 2, 1, 0, 6, 11];
let newArray = [];
let counts = {};

for (let index = 0; index < nums.length; index++) {
	const element = nums[index];
	// Count the occurrences of each element
	counts[element] = (counts[element] || 0) + 1;
}
console.log("counts", counts);

for (let index = 0; index < nums.length; index++) {
	const element = nums[index];

	// Add elements that occur exactly once to the newArray
	if (counts[element] === 1) {
		newArray.push(element);
	}
}

let result = newArray.sort((a, b) => b - a);

console.log("result", result);
