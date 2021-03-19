document.addEventListener("turbo:load", () => afterLoad(), false);

function afterLoad() {
	validateForms();

	var t = document.getElementsByClassName("sidebar")[0];
	document.getElementsByClassName("sidebar-toggle")[0].addEventListener("click", function () {
		t.classList.toggle("collapsed"),
			t.addEventListener("transitionend", function () {
				window.dispatchEvent(new Event("resize"));
			});
	});
}

function validateForms() {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll(".needs-validation");

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function (form) {
		form.addEventListener(
			"submit",
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add("was-validated");
			},
			false
		);
	});
}
