document.getElementById("convertJsonToMysql").addEventListener("click", function() {
    const jsonInput = document.getElementById("jsonInput").value;
    try {
        const jsonData = JSON.parse(jsonInput);
        const mysqlOutput = convertJsonToMysql(jsonData);
        document.getElementById("mysqlOutput").value = mysqlOutput;
    } catch (error) {
        alert("Invalid JSON input. Please check your JSON and try again.");
    }
});