"use client";

import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Bold, Italic, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Toggle } from "~/components/ui/toggle";
import Link from "next/link";
// Interfaces
interface Employee {
  id: number;
  name: string | null;
  birthday: string | null;
  gender: string | null;
  salary: string | null;
  progLang: string | null;
  importance: string | null;
}

interface StyleState {
  cellFontSize: string;
  cellFontName: string;
  cellColor: string;
  headerColor: string;
  isItalic: boolean;
  isBold: boolean;
}

interface AppState {
  employees: Employee[];
  style: StyleState;
}

// Initial data

const initialStyle: StyleState = {
  cellFontSize: "18",
  cellFontName: "Times New Roman",
  cellColor: "#71717a",
  headerColor: "#18181b",
  isItalic: false,
  isBold: false,
};

// Memento Pattern Implementation
class Memento {
  constructor(private state: AppState) {}

  getState(): AppState {
    return this.state;
  }
}

class Originator {
  private state: AppState;

  constructor(initialState: AppState) {
    this.state = initialState;
  }

  setState(state: AppState): void {
    this.state = state;
  }

  getState(): AppState {
    return this.state;
  }

  saveToMemento(): Memento {
    return new Memento({ ...this.state });
  }

  restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
  }
}

class Caretaker {
  private mementos: Memento[] = [];
  private currentIndex = -1;

  addMemento(memento: Memento): void {
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    this.mementos.push(memento);
    this.currentIndex++;
  }

  getMemento(index: number): Memento | null {
    if (index >= 0 && index < this.mementos.length) {
      return this.mementos[index]!;
    }
    return null;
  }

  undo(): Memento | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.mementos[this.currentIndex]!;
    }
    return null;
  }

  redo(): Memento | null {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      return this.mementos[this.currentIndex]!;
    }
    return null;
  }
}

export function EmployeeManagement({ employees }: { employees: Employee[] }) {
  const initialState: AppState = {
    employees: employees,
    style: initialStyle,
  };
  const [originator] = useState(() => new Originator(initialState));
  const [caretaker] = useState(() => new Caretaker());
  const [, forceUpdate] = useState({});
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    caretaker.addMemento(originator.saveToMemento());
  }, [caretaker, originator]);

  const updateState = (newState: AppState) => {
    originator.setState(newState);
    caretaker.addMemento(originator.saveToMemento());
    forceUpdate({});
  };

  const handleAction = (action: string) => {
    let memento: Memento | null = null;
    switch (action) {
      case "START":
      case "RESET":
        originator.setState(initialState);
        caretaker.addMemento(originator.saveToMemento());
        break;
      case "UNDO":
        memento = caretaker.undo();
        if (memento) originator.restoreFromMemento(memento);
        break;
      case "REDO":
        memento = caretaker.redo();
        if (memento) originator.restoreFromMemento(memento);
        break;
    }
    forceUpdate({});
  };

  const handleInsertEmployee = () => {
    const currentState = originator.getState();
    const newEmployee: Employee = {
      id: currentState.employees.length + 1,
      name: `Employee ${currentState.employees.length + 1}`,
      birthday: "01-01-2000",
      gender: "Male",
      salary: "$50000",
      progLang: "Java",
      importance: "base",
    };
    updateState({
      ...currentState,
      employees: [...currentState.employees, newEmployee],
    });
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    const currentState = originator.getState();
    const newEmployees = currentState.employees.map((emp) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp,
    );
    updateState({ ...currentState, employees: newEmployees });
    setEditingEmployee(null);
    setOpenDialog(false);
  };

  const handleDeleteEmployee = (id: number) => {
    const currentState = originator.getState();
    const newEmployees = currentState.employees.filter((emp) => emp.id !== id);
    updateState({ ...currentState, employees: newEmployees });
  };

  const handleStyleChange = (
    key: keyof StyleState,
    value: string | boolean,
  ) => {
    const currentState = originator.getState();
    updateState({
      ...currentState,
      style: { ...currentState.style, [key]: value },
    });
  };

  const currentState = originator.getState();

  return (
    <div className="flex h-full w-full justify-between">
      <div className="h-screen w-72 border-r bg-white p-4">
        <div className="flex h-full flex-col">
          <div>
            <h2 className="mb-4 pt-3 text-xl font-bold">Settings</h2>
            <Separator className="my-4" />
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="cellFontSize">Font Size</Label>
              <Input
                id="cellFontSize"
                type="number"
                value={currentState.style.cellFontSize}
                onChange={(e) =>
                  handleStyleChange("cellFontSize", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="cellFontName">Font Family</Label>
              <Select
                value={currentState.style.cellFontName}
                onValueChange={(value) =>
                  handleStyleChange("cellFontName", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">
                    Times New Roman
                  </SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cellColor">Cell Color</Label>
              <Input
                id="cellColor"
                type="color"
                value={currentState.style.cellColor}
                onChange={(e) => handleStyleChange("cellColor", e.target.value)}
                className="h-10 w-full"
              />
            </div>
            <div>
              <Label htmlFor="headerColor">Header Color</Label>
              <Input
                id="headerColor"
                type="color"
                value={currentState.style.headerColor}
                onChange={(e) =>
                  handleStyleChange("headerColor", e.target.value)
                }
                className="h-10 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Toggle
                id="italic"
                pressed={currentState.style.isItalic}
                onPressedChange={(pressed) =>
                  handleStyleChange("isItalic", pressed)
                }
                aria-label="Toggle italic"
              >
                <Italic className="mr-2 h-4 w-4" />
                Italic
              </Toggle>
              <Toggle
                id="bold"
                pressed={currentState.style.isBold}
                onPressedChange={(pressed) =>
                  handleStyleChange("isBold", pressed)
                }
                aria-label="Toggle bold"
              >
                <Bold className="mr-2 h-4 w-4" />
                Bold
              </Toggle>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="mt-4">
            <Link href="/">
              <Button variant={"ghost"} className="w-full justify-between">
                Go to main page
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-screen flex-1 overflow-auto pt-2">
        <Card className="w-full border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl">
              Employee Management Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between pt-4">
              <div className="mb-4 flex space-x-2">
                <Button variant={"ghost"} onClick={() => handleAction("UNDO")}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Undo
                </Button>

                <Button variant={"ghost"} onClick={() => handleAction("REDO")}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 scale-x-[-1]"
                  >
                    <path
                      d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Redo
                </Button>
                <Button variant={"ghost"} onClick={() => handleAction("RESET")}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Reset
                </Button>
              </div>

              <Button onClick={handleInsertEmployee} className="mb-4">
                Add new employee
              </Button>
            </div>

            <div className="w-full rounded-md border">
              <Table
                style={{
                  fontStyle: currentState.style.isItalic ? "italic" : "normal",
                  fontSize: `${currentState.style.cellFontSize}px`,
                  fontFamily: currentState.style.cellFontName,
                  fontWeight: currentState.style.isBold ? "bold" : "normal",
                }}
              >
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead
                      className="pl-8"
                      style={{
                        color: currentState.style.headerColor,
                        fontWeight: currentState.style.isBold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      Name
                    </TableHead>
                    <TableHead
                      style={{
                        color: currentState.style.headerColor,
                        fontWeight: currentState.style.isBold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      Birthday
                    </TableHead>
                    <TableHead
                      style={{
                        color: currentState.style.headerColor,
                        fontWeight: currentState.style.isBold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      Gender
                    </TableHead>
                    <TableHead
                      style={{
                        color: currentState.style.headerColor,
                        fontWeight: currentState.style.isBold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      Salary
                    </TableHead>
                    <TableHead
                      style={{
                        color: currentState.style.headerColor,
                        fontWeight: currentState.style.isBold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      Prog Lang
                    </TableHead>
                    <TableHead
                      style={{
                        color: currentState.style.headerColor,
                        fontWeight: currentState.style.isBold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      Importance
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentState.employees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      style={{ color: currentState.style.cellColor }}
                    >
                      <TableCell className="pl-8">{employee.name}</TableCell>
                      <TableCell>{employee.birthday}</TableCell>
                      <TableCell>{employee.gender}</TableCell>
                      <TableCell>{employee.salary}</TableCell>
                      <TableCell>{employee.progLang}</TableCell>
                      <TableCell>{employee.importance}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setOpenDialog(true);
                                setEditingEmployee(employee);
                              }}
                            >
                              Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleUpdateEmployee}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
interface EmployeeFormProps {
  employee: Employee | null;
  onSubmit: (employee: Employee) => void;
}

function EmployeeForm({ employee, onSubmit }: EmployeeFormProps) {
  const [formData, setFormData] = useState(
    employee ?? {
      id: 0,
      name: "",
      birthday: "",
      gender: "",
      salary: "",
      progLang: "",
      importance: "",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name!}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="birthday">Birthday</Label>
        <Input
          id="birthday"
          name="birthday"
          value={formData.birthday!}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          name="gender"
          value={formData.gender!}
          onValueChange={(value) =>
            handleChange({ target: { name: "gender", value } } as never)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          name="salary"
          value={formData.salary!}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="progLang">Programming Language</Label>
        <Input
          id="progLang"
          name="progLang"
          value={formData.progLang!}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="importance">Importance</Label>
        <Select
          name="importance"
          value={formData.importance!}
          onValueChange={(value) =>
            handleChange({ target: { name: "importance", value } } as never)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select importance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="middle">Middle</SelectItem>
            <SelectItem value="TOP">TOP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
