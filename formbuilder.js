
export function buildForm(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Invalid container selector");
        return;
    }

    const style = document.createElement("style");
    style.id = "formbuilder-styles";
    style.textContent = `
        .dynamic-form {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .question-wrapper {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
        }
        .question-wrapper input[type="text"],
        .question-wrapper input[type="number"],
        .question-wrapper textarea,
        .question-wrapper select {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        .question-wrapper button {
            padding: 8px 12px;
            margin: 5px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
        .question-wrapper button:hover {
            background-color: #0056b3;
        }
        .options-container {
            margin-top: 10px;
        }
        .error-message {
            color: red;
            font-size: 12px;
            margin-top: 5px;
        }
        .mandatory-label {
            margin-left: 5px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

    //form element
    const form = document.createElement("form");
    form.id = "dynamicForm";

    const questionContainer = document.createElement("div");
    questionContainer.id = "questionContainer";
    form.appendChild(questionContainer);

    const addQuestionBtn = document.createElement("button");
    addQuestionBtn.type = "button";
    addQuestionBtn.textContent = "Add Question";
    addQuestionBtn.addEventListener("click", addQuestion);
    form.appendChild(addQuestionBtn);

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    submitBtn.addEventListener("click", handleSubmit);
    form.appendChild(submitBtn);

    container.appendChild(form);
}

function addQuestion() {
    const questionContainer = document.getElementById("questionContainer");

    const questionWrapper = document.createElement("div");
    questionWrapper.className = "question-wrapper";

    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Enter question";
    questionInput.className = "question";

    const mandatoryCheckbox = document.createElement("input");
    mandatoryCheckbox.type = "checkbox";
    mandatoryCheckbox.className = "mandatory";
    const mandatoryLabel = document.createElement("label");
    mandatoryLabel.textContent = "Mandatory";
    mandatoryLabel.appendChild(mandatoryCheckbox);

    // Select field for input type
    const inputTypeSelect = document.createElement("select");
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select input type";
    inputTypeSelect.appendChild(defaultOption);
    ["text", "number", "radio", "checkbox", "date", "email", "textarea", "select"].forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        inputTypeSelect.appendChild(option);
    });

    let answerField = null;
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options-container";

    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.style.color = "red";

    inputTypeSelect.addEventListener("change", function () {
        if (answerField) {
            questionWrapper.removeChild(answerField);
            answerField = null;
        }
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }

        if (this.value === "textarea") {
            answerField = document.createElement("textarea");
            const charLimit = document.createElement("input");
            charLimit.type = "number";
            charLimit.placeholder = "Max characters";
            charLimit.addEventListener("input", () => {
                answerField.maxLength = charLimit.value;
                validateMaxCharacters(answerField, errorMessage, charLimit.value);
            });
            optionsContainer.appendChild(charLimit);
        } else if (this.value === "number") {
            answerField = document.createElement("input");
            answerField.type = "number";

            const minInput = document.createElement("input");
            minInput.type = "number";
            minInput.placeholder = "Min value";
            minInput.addEventListener("input", () => {
                answerField.min = minInput.value;
            });

            const maxInput = document.createElement("input");
            maxInput.type = "number";
            maxInput.placeholder = "Max value";
            maxInput.addEventListener("input", () => {
                answerField.max = maxInput.value;
            });

            optionsContainer.appendChild(minInput);
            optionsContainer.appendChild(maxInput);
        } else if (this.value === "radio" || this.value === "checkbox") {
            const addOptionBtn = document.createElement("button");
            addOptionBtn.type = "button";
            addOptionBtn.textContent = "Add Option";

            addOptionBtn.addEventListener("click", () => {
                const optionWrapper = document.createElement("div");
                const optionInput = document.createElement("input");
                optionInput.type = this.value;
                optionInput.name = `option-${questionContainer.children.length}`;
                optionInput.className = "option-input";
                const labelInput = document.createElement("input");
                labelInput.type = "text";
                labelInput.placeholder = "Option label";
                const removeOptionBtn = document.createElement("button");
                removeOptionBtn.type = "button";
                removeOptionBtn.textContent = "Remove";
                removeOptionBtn.addEventListener("click", () => optionsContainer.removeChild(optionWrapper));
                optionWrapper.appendChild(optionInput);
                optionWrapper.appendChild(labelInput);
                optionWrapper.appendChild(removeOptionBtn);
                optionsContainer.appendChild(optionWrapper);
            });

            optionsContainer.appendChild(addOptionBtn);
        } else if (this.value === "select") {
            answerField = document.createElement("select");
            const defaultSelectOption = document.createElement("option");
            defaultSelectOption.value = "";
            defaultSelectOption.textContent = "Select an option";
            answerField.appendChild(defaultSelectOption);
            const addOptionBtn = document.createElement("button");
            addOptionBtn.type = "button";
            addOptionBtn.textContent = "Add Option";

            addOptionBtn.addEventListener("click", () => {
                const optionWrapper = document.createElement("div");
                const optionInput = document.createElement("option");
                const labelInput = document.createElement("input");
                labelInput.type = "text";
                labelInput.placeholder = "Option label";
                const removeOptionBtn = document.createElement("button");
                removeOptionBtn.type = "button";
                removeOptionBtn.textContent = "Remove";
                removeOptionBtn.addEventListener("click", () => answerField.removeChild(optionInput));
                optionInput.textContent = labelInput.value;
                labelInput.addEventListener("input", () => {
                    optionInput.textContent = labelInput.value;
                });

                optionWrapper.appendChild(labelInput);
                optionWrapper.appendChild(removeOptionBtn);
                optionsContainer.appendChild(optionWrapper);
                answerField.appendChild(optionInput);
            });

            optionsContainer.appendChild(addOptionBtn);
        } else if (this.value === "text" || this.value === "email" || this.value === "date") {
            answerField = document.createElement("input");
            answerField.type = this.value;

            if (this.value === "text") {
                const charLimit = document.createElement("input");
                charLimit.type = "number";
                charLimit.placeholder = "Max characters";
                charLimit.addEventListener("input", () => {
                    answerField.maxLength = charLimit.value;
                    validateMaxCharacters(answerField, errorMessage, charLimit.value);
                });
                optionsContainer.appendChild(charLimit);
            }
        }

        if (answerField) {
            answerField.className = "answer";
            questionWrapper.appendChild(answerField);
        }
        questionWrapper.appendChild(optionsContainer);
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => questionContainer.removeChild(questionWrapper));

    questionWrapper.appendChild(questionInput);
    questionWrapper.appendChild(mandatoryLabel);
    questionWrapper.appendChild(inputTypeSelect);
    questionWrapper.appendChild(optionsContainer);
    questionWrapper.appendChild(removeBtn);
    questionWrapper.appendChild(errorMessage);

    questionContainer.appendChild(questionWrapper);
}

function handleSubmit(event) {
    event.preventDefault();

    const questions = document.querySelectorAll(".question-wrapper");
    const formData = [];
    let isValid = true;

    questions.forEach(wrapper => {
        const question = wrapper.querySelector(".question").value;
        const inputType = wrapper.querySelector("select").value;
        const isMandatory = wrapper.querySelector(".mandatory").checked;
        const errorMessage = wrapper.querySelector(".error-message");
        errorMessage.textContent = "";
        if (isMandatory && !question) {
            errorMessage.textContent = "Question is required.";
            isValid = false;
            return;
        }

        if (inputType === "radio" || inputType === "checkbox") {
            const options = wrapper.querySelectorAll(".option-input");
            const selectedOptions = Array.from(options).filter(option => option.checked);

            if (options.length === 0) {
                errorMessage.textContent = "At least one option is required.";
                isValid = false;
            } else if (isMandatory && selectedOptions.length === 0) {
                errorMessage.textContent = "Please select at least one option.";
                isValid = false;
            } else {
                const selectedLabels = selectedOptions.map(option => {
                    const labelInput = option.parentElement.querySelector("input[type='text']");
                    return labelInput ? labelInput.value : null;
                }).filter(label => label !== null);
                formData.push({
                    question,
                    answer: selectedLabels
                });
            }
        } else if (inputType === "select") {
            const options = wrapper.querySelectorAll("select.answer option");
            const selectedOption = wrapper.querySelector("select.answer option:checked");

            if (options.length <= 1) {
                errorMessage.textContent = "At least one option is required.";
                isValid = false;
            } else if (isMandatory && (!selectedOption || selectedOption.value === "")) {
                errorMessage.textContent = "Please select an option.";
                isValid = false;
            } else if (selectedOption && selectedOption.value !== "") {
                formData.push({
                    question,
                    answer: selectedOption.textContent
                });
            }
        } else if (inputType !== "") {
            const answerField = wrapper.querySelector(".answer");
            const answer = answerField.value;

            if (isMandatory && !answer) {
                errorMessage.textContent = "Answer is required.";
                isValid = false;
            } else if (inputType === "email" && isMandatory && !validateEmail(answer)) {
                errorMessage.textContent = "Invalid email address.";
                isValid = false;
            } else if (inputType === "number" && (answerField.min || answerField.max)) {
                const min = parseFloat(answerField.min);
                const max = parseFloat(answerField.max);

                if (!isNaN(min) && !isNaN(max)) {
                    if (parseFloat(answer) < min || parseFloat(answer) > max) {
                        errorMessage.textContent = `Value must be between ${min} and ${max}.`;
                        isValid = false;
                    }
                } else if (!isNaN(min) && parseFloat(answer) < min) {
                    errorMessage.textContent = `Value must be greater than or equal to ${min}.`;
                    isValid = false;
                } else if (!isNaN(max) && parseFloat(answer) > max) {
                    errorMessage.textContent = `Value must be less than or equal to ${max}.`;
                    isValid = false;
                } else {
                    formData.push({ question, answer });
                }
            } else if ((inputType === "text" || inputType === "textarea") && answerField.maxLength) {
                if (answerField.maxLength != -1 && answer.length > answerField.maxLength) {
                    errorMessage.textContent = `Value exceeds the maximum character limit of ${answerField.maxLength}.`;
                    isValid = false;
                } else {
                    formData.push({ question, answer });
                }
            } else {
                formData.push({ question, answer });
            }
        }
    });

    if (isValid) {
        console.log("Form Data:", formData);
    }
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateMaxCharacters(field, errorMessage, maxLength) {
    if (!maxLength) {
        errorMessage.textContent = "";
        return;
    }
    if (field.value.length > maxLength) {
        errorMessage.textContent = `Value exceeds the maximum character limit of ${maxLength}.`;
    } else {
        errorMessage.textContent = "";
    }
}