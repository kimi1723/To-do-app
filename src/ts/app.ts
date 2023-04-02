const toDoAddBtn = document.querySelector('.to-do-header__add-button') as HTMLButtonElement;
const toDoInput = document.querySelector('.to-do-header__input') as HTMLInputElement;
const toDoAssignmentsContainer = document.querySelector('.to-do-assignments') as HTMLDivElement;
let toDoAssignmentID: number = 1;

const validateToDo = (): boolean => {
	const toDoError = document.querySelector('.to-do-header__error') as HTMLParagraphElement;

	if (toDoInput.value === '') {
		toDoError.classList.add('to-do-header__error--active');
		toDoError.classList.add('to-do-header__error--active-visibility');
		return false;
	} else {
		toDoError.classList.remove('to-do-header__error--active');
		setTimeout(() => {
			toDoError.classList.remove('to-do-header__error--active-visibility');
		}, 300);
		return true;
	}
};

const createToDoBody = (): void => {
	const template = document.querySelector('.to-do-assignment-template') as HTMLTemplateElement;

	const toDoAssignment = template.content.cloneNode(true) as HTMLElement;
	const toDoAssignmentText = toDoAssignment.querySelector('.to-do-assignment__text') as HTMLParagraphElement;
	const toDoAssignmentContainer = toDoAssignment.querySelector('.to-do-assignment') as HTMLDivElement;

	toDoAssignmentContainer.dataset.id = toDoAssignmentID.toString();

	toDoAssignmentText.textContent = toDoInput.value;

	toDoAssignmentsContainer.append(toDoAssignment);

	localStorage.setItem(`${toDoAssignmentID}`, toDoAssignmentContainer.outerHTML);
	toDoAssignmentID++;
};

const addToDo = (): void => {
	if (validateToDo() === false) return;
	createToDoBody();
};

const loadStoragedToDos = () => {
	const storagedToDos = { ...localStorage };

	for (const toDo in storagedToDos) {
		toDoAssignmentsContainer.innerHTML += storagedToDos[toDo];

		toDoAssignmentID = Number(toDo) + 1;
	}
};

toDoAddBtn.addEventListener('click', addToDo);

window.addEventListener('DOMContentLoaded', loadStoragedToDos);

