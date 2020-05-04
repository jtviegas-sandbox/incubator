	/**
	 * Displays a list of steps that are dependent on each other
	 */
	displayTaskList: function () {
		var LAST_POSITION = -1;
	
		// Get the div container here instead
		this.content_item.innerText = this.dependenciesLabel + " ";

		// Delete row until only th remains.
		while(this.content_item.rows.length > 1){
			this.dependenciesTable.deleteRow(LAST_POSITION);
		}

		//this.checkBoxArray = [];

		//var stepNames = [];
		//var planDependencyList = []; 
		
		var taskListArray = ["Install Latest Automation Plan Engine", "Restart Service", "Create Windows VM from Template"];

		//var that = this;

		for (var i = 0; i < taskListArray.length; i++) {
			
			// Create a row for every step that isn't this step.
			if (taskListArray[i]) {

				var checkBox = document.createElement('input');
				checkBox.type = "checkbox";
				checkBox.disabled = "false";
				
		

				var dependencyRow = that.dependenciesTable.insertRow(LAST_POSITION);

				var checkBoxCell = dependencyRow.insertCell(LAST_POSITION);
				checkBoxCell.appendChild(checkBox);

				// Have to be set to "checked" AFTER they've been appended to the parent div.
				if(that.dependencyList.contains(stepWidget.step_id)){
					checkBox.checked = true;

					var dependencyText = " " + stepWidget.step_id + " - " + stepWidget.fixletSrc.name;
					if (dependencyText.length > 20) {
						dependencyText = dependencyText.substring(0, 17) + "...";
					}

					stepNames.push(dependencyText);
				}

				checkBoxCell.style.textAlign="center";

				that.checkBoxArray.push(checkBox);

				var idCell = dependencyRow.insertCell(LAST_POSITION);
				idCell.innerText = stepWidget.step_id;
				idCell.style.textAlign = "center";

				var nameCell = dependencyRow.insertCell(LAST_POSITION);
				nameCell.innerText = stepWidget.fixletSrc.name;
			}
		};
		

	}