# README

Form Builder Script

Include the Script
To use the Form Builder, ensure the formbuilder.js script is included in your HTML file. Add the following line to your HTML:

```
<script type="module" src="formbuilder.js"></script>
```

Initialize the Form Builder
To initialize the form builder, call the buildForm function with the selector of the container where the form should be rendered.

```
import { buildForm } from './formbuilder.js';
buildForm('#formBuilderContaine');
```
Replace #form-container with the ID or class of the container where you want the form to appear.


Add Questions
Once the form is initialized, you can dynamically add questions to it:

    1. Click the "Add Question" button to create a new question.
    2. Customize each question by:
        * Entering the question text.
        * Selecting the input type (e.g., text, number, radio, checkbox, date, email, textarea, select).
        * Setting validation rules (e.g., mandatory fields, character limits, min/max values).

Submit the Form
To submit the form:
    1. Click the "Submit" button.
    2. The script will validate all inputs based on the rules you set.
    3. If all validations pass, the form data will be logged to the console.
    Note: You can change the handleSubmit() to change the behaviour of the submit button. For ex: Sending the data to another API.

Basic Styling
The script includes default styles for the form and its elements. You can customize these styles by modifying the style element created within the buildForm function.

Note:
    1. The script is modular and can be extended to support additional input types or validation rules.
    2. Error messages are displayed inline with each question for immediate feedback.


