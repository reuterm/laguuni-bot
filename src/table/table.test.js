const { Table } = require("./table");

describe("table", () => {
  describe("setColumns", () => {
    it("should set column names", () => {
      const table = new Table();
      table.setColumns(["a", "b", "c"]);
      expect(table.columnNames).toEqual(["a", "b", "c"]);
    });

    it("should reset rows", () => {
      const table = new Table();
      table.addRow(["a", "b", "c"]);
      table.setColumns(["a", "b", "c"]);
      expect(table.rows).toEqual([]);
    });

    it("should reset maxWidth", () => {
      const table = new Table();
      table.setColumns(["a", "b", "c"]);
      expect(table.maxWidth).toEqual([1, 1, 1]);
      table.setColumns(["a", "b", "cd"]);
      expect(table.maxWidth).toEqual([1, 1, 2]);
    });
  });

  describe("addRow", () => {
    it("should add a row", () => {
      const table = new Table();
      table.addRow(["a", "b", "c"]);
      expect(table.rows).toEqual([["a", "b", "c"]]);
    });

    it("should update maxWidth", () => {
      const table = new Table();
      table.setColumns(["a", "b", "c"]);
      expect(table.maxWidth).toEqual([1, 1, 1]);
      table.addRow(["a", "b", "cd"]);
      expect(table.maxWidth).toEqual([1, 1, 2]);
    });
  });

  describe("toString", () => {
    it("should return empty string if no columns", () => {
      const table = new Table();
      expect(table.toString()).toEqual("");
    });
    it("should return table string", () => {
      const table = new Table();
      table.setColumns(["one", "two", "three"]);
      table.addRow(["a", "b", "c"]);
      table.addRow(["a", "b", "cd"]);
      expect(table.toString()).toEqual(
        "+-----+-----+-------+\n| one | two | three |\n+-----+-----+-------+\n| a   | b   | c     |\n| a   | b   | cd    |\n+-----+-----+-------+\n"
      );
    });
  });
});
