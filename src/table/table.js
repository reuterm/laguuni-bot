class Table {
  constructor() {
    this.columnNames = [];
    this.rows = [];
    this.maxWidth = [];
  }

  setColumns(names) {
    this.columnNames = names;
    this.rows = [];
    this.maxWidth = [];
    names.forEach((name) => this.maxWidth.push(name.length));
  }

  addRow(row) {
    this.rows.push(row);
    for (let i = 0; i < row.length; i++) {
      if (row[i].toString().length > this.maxWidth[i]) {
        this.maxWidth[i] = row[i].toString().length;
      }
    }
  }

  toString() {
    let tableString = "";

    const seperatorLine = this.maxWidth.reduce(
      (acc, cur) => acc + "-".repeat(cur + 2) + "+",
      "+"
    );

    if (this.columnNames.length === 0) {
      return tableString;
    }

    let header = "| ";
    for (let i = 0; i < this.columnNames.length; i++) {
      header += this.columnNames[i];
      // Adjust for max width of the column and pad spaces
      if (this.columnNames[i].length < this.maxWidth[i]) {
        let lengthDifference = this.maxWidth[i] - this.columnNames[i].length;
        header += Array(lengthDifference + 1).join(" ");
      }
      header += " | ";
    }
    header = header.slice(0, -1);
    tableString += seperatorLine + "\n";
    tableString += header + "\n";
    tableString += seperatorLine + "\n";

    let body = "";
    for (let i = 0; i < this.rows.length; i++) {
      let rowString = "| ";
      for (let k = 0; k < this.rows[i].length; k++) {
        rowString += this.rows[i][k];
        // Adjust max width of each cell and pad spaces as necessary
        if (this.rows[i][k].toString().length < this.maxWidth[k]) {
          let lengthDifference =
            this.maxWidth[k] - this.rows[i][k].toString().length;
          rowString += Array(lengthDifference + 1).join(" ");
        }
        rowString += " | ";
      }
      rowString = rowString.slice(0, -1);
      body += rowString + "\n";
    }
    tableString += body;
    tableString += seperatorLine + "\n";
    return tableString;
  }
}

module.exports = {
  Table,
};
