const toDoAssignmentsContainer = document.querySelector('.to-do-assignments') as HTMLDivElement;
const editAssignmentContainer = document.querySelector('.to-do-edit-assignment') as HTMLDivElement;
const heroBG = document.querySelector('.to-do-edit-assignment-hero-bg') as HTMLDivElement;
const editError = document.querySelector('.to-do-edit-assignment__error') as HTMLParagraphElement;

const toDoInput = document.querySelector('.to-do-header__input') as HTMLInputElement;
const editInput = document.querySelector('.to-do-edit-assignment__input') as HTMLInputElement;
const toDoAddBtn = document.querySelector('.to-do-header__add-button') as HTMLButtonElement;
const acceptEditBtn = document.querySelector('.to-do-edit-assignment__button--accept') as HTMLButtonElement;
const cancelEditBtn = document.querySelector('.to-do-edit-assignment__button--cancel') as HTMLButtonElement;

let toDoAssignmentID: number = 1,
	assignmentText: HTMLParagraphElement,
	actualAssignment: HTMLDivElement,
	assignmentID: string,
	allInteractiveElements: (HTMLButtonElement | HTMLInputElement)[] = [];

const addToDo = (): void => {
	if (validateToDo() === false) return;
	createToDoBody();
	clearToDoInput();
};

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
	const toDoAssignmentDeleteBtn = toDoAssignment.querySelector(
		'.to-do-assignment-buttons__button--remove',
	) as HTMLButtonElement;

	toDoAssignmentContainer.addEventListener('click', btnsFunctions);
	toDoAssignmentContainer.dataset.id = toDoAssignmentID.toString();

	toDoAssignmentText.textContent = toDoInput.value;

	toDoAssignmentsContainer.append(toDoAssignment);

	localStorage.setItem(`${toDoAssignmentID}`, toDoAssignmentContainer.outerHTML);
	toDoAssignmentID++;
};

const clearToDoInput = (): void => {
	toDoInput.value = '';
};

const btnsFunctions = (e: Event) => {
	actualAssignment = e.currentTarget as HTMLDivElement;
	const assignmentDoneButton = actualAssignment.querySelector(
		'.to-do-assignment-buttons__button--done',
	) as HTMLButtonElement;
	const assignmentDoneButtonIcon = actualAssignment.querySelector('.fa-check') as HTMLElement;
	const assignmentEditButton = actualAssignment.querySelector(
		'.to-do-assignment-buttons__button--edit',
	) as HTMLButtonElement;
	const assignmentDeleteButtonIcon = actualAssignment.querySelector('.fa-xmark') as HTMLElement;
	const assignmentDeleteButton = actualAssignment.querySelector(
		'.to-do-assignment-buttons__button--remove',
	) as HTMLButtonElement;
	assignmentText = actualAssignment.querySelector('.to-do-assignment__text') as HTMLParagraphElement;
	assignmentID = actualAssignment.dataset.id as string;

	switch (e.target) {
		case assignmentDoneButton:
		case assignmentDoneButtonIcon:
			completeToDo();
			break;

		case assignmentEditButton:
			editToDo();
			break;

		case assignmentDeleteButton:
		case assignmentDeleteButtonIcon:
			deleteToDo();
			break;

		default:
			return;
	}
};

const completeToDo = (): void => {
	assignmentText.classList.toggle('to-do-assignment__text--done');
	localStorage.setItem(assignmentID, actualAssignment.outerHTML);
};

const editToDo = (): void => {
	editInput.value = assignmentText.textContent!;
	showEditPanel();
};

const deleteToDo = (): void => {
	actualAssignment.remove();
	localStorage.removeItem(assignmentID);
};

const acceptEdit = (): void => {
	if (editInput.value !== '') {
		assignmentText.textContent = editInput.value;
		localStorage.setItem(assignmentID, actualAssignment.outerHTML);
		editError.classList.remove('to-do-edit-assignment__error--active');
		hideEditPanel();
	} else {
		editError.classList.add('to-do-edit-assignment__error--active');
	}
};

const cancelEdit = (): void => {
	editError.classList.remove('to-do-edit-assignment__error--active');
	hideEditPanel();
};

const showEditPanel = (): void => {
	allInteractiveElements = [];
	const allButtons = document.querySelectorAll(
		'button:not(.to-do-edit-assignment__button)',
	) as NodeListOf<HTMLButtonElement>;

	allInteractiveElements.push(...allButtons);
	allInteractiveElements.push(toDoInput);

	allInteractiveElements.forEach(el => (el.tabIndex = -1));

	editAssignmentContainer.classList.add('to-do-edit-assignment--active');
	heroBG.classList.add('to-do-edit-assignment-hero-bg--active');
	editAssignmentContainer.classList.add('to-do-edit-assignment--active-visibility');
	heroBG.classList.add('to-do-edit-assignment-hero-bg--active-visibility');
};

const hideEditPanel = (): void => {
	allInteractiveElements.forEach(el => (el.tabIndex = 0));

	editAssignmentContainer.classList.remove('to-do-edit-assignment--active');
	heroBG.classList.remove('to-do-edit-assignment-hero-bg--active');

	setTimeout(() => {
		editAssignmentContainer.classList.remove('to-do-edit-assignment--active-visibility');
		heroBG.classList.remove('to-do-edit-assignment-hero-bg--active-visibility');
	}, 400);
};

const loadStoragedToDos = () => {
	const storagedToDos = { ...localStorage };

	for (const toDo in storagedToDos) {
		toDoAssignmentsContainer.innerHTML += storagedToDos[toDo];

		toDoAssignmentID = Number(toDo) + 1;
	}

	const toDos: NodeListOf<HTMLDivElement> = document.querySelectorAll('.to-do-assignment');
	toDos.forEach(toDo => toDo.addEventListener('click', btnsFunctions));
};

toDoAddBtn.addEventListener('click', addToDo);
acceptEditBtn.addEventListener('click', acceptEdit);
cancelEditBtn.addEventListener('click', cancelEdit);
window.addEventListener('DOMContentLoaded', loadStoragedToDos);
