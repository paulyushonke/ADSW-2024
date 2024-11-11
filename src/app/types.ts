export interface Employee {
  id: number;
  name: string | null;
  birthday: string | null;
  gender: string | null;
  salary: string | null;
  progLang: string | null;
  importance: string | null;
}

export interface StyleState {
  cellFontSize: string;
  cellFontName: string;
  cellColor: string;
  headerColor: string;
  isItalic: boolean;
  isBold: boolean;
}

export interface AppState {
  employees: Employee[];
  style: StyleState;
}

export const initialStyle: StyleState = {
  cellFontSize: "18",
  cellFontName: "Times New Roman",
  cellColor: "#71717a",
  headerColor: "#18181b",
  isItalic: false,
  isBold: false,
};
