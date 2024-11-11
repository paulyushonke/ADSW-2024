"use client";

import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Label } from "~/components/ui/label";
import { Toggle } from "~/components/ui/toggle";
import { Bold, Italic } from "lucide-react";
import Link from "next/link";

import { type Employee, type AppState, initialStyle } from "../types";
import { Originator, Caretaker } from "./memento";
import { ReportFactory } from "./reportFactory";
import { FILTER_OPTIONS, type FilterableFields } from "./reportTemplates";

export function EmployeeManagement({ employees }: { employees: Employee[] }) {
  const initialState: AppState = {
    employees: employees,
    style: initialStyle,
  };

  const [originator] = useState(() => new Originator(initialState));
  const [caretaker] = useState(() => new Caretaker());
  const [, forceUpdate] = useState({});

  // Report states
  const [reportType, setReportType] = useState<string>("full");
  const [filterCriteria, setFilterCriteria] =
    useState<FilterableFields>("gender");
  const [filterValue, setFilterValue] = useState<string>("");
  const [reportAuthor, setReportAuthor] = useState<string>("");

  useEffect(() => {
    caretaker.addMemento(originator.saveToMemento());
  }, [caretaker, originator]);

  const updateState = (newState: AppState) => {
    originator.setState(newState);
    caretaker.addMemento(originator.saveToMemento());
    forceUpdate({});
  };

  const handleAction = (action: string) => {
    let memento = null;
    switch (action) {
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

  const generateReport = () => {
    try {
      const report = ReportFactory.createReport(
        reportType,
        filterCriteria,
        filterValue,
      );

      const reportContent = report.generateReport(
        originator.getState().employees,
        reportAuthor || "Anonymous",
      );

      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employee_report_${reportType}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleStyleChange = (
    key: keyof typeof initialStyle,
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
      {/* Sidebar */}
      <div className="h-screen w-72 border-r bg-white p-4">
        <div className="flex h-full flex-col">
          <div>
            <h2 className="mb-4 pt-3 text-xl font-bold">Settings</h2>
          </div>

          <div className="flex flex-col space-y-4">
            {/* Style controls */}
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
                pressed={currentState.style.isItalic}
                onPressedChange={(pressed) =>
                  handleStyleChange("isItalic", pressed)
                }
              >
                <Italic className="mr-2 h-4 w-4" />
                Italic
              </Toggle>
              <Toggle
                pressed={currentState.style.isBold}
                onPressedChange={(pressed) =>
                  handleStyleChange("isBold", pressed)
                }
              >
                <Bold className="mr-2 h-4 w-4" />
                Bold
              </Toggle>
            </div>
          </div>

          <div className="flex-1"></div>
          <div className="mt-4">
            <Link href="/">
              <Button variant="ghost" className="">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Go to main page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-screen flex-1 overflow-auto pt-2">
        <Card className="w-full border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl">
              Employee Management Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Report Generation Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Report</SelectItem>
                    <SelectItem value="short">Short Report</SelectItem>
                    <SelectItem value="filtered">Filtered Report</SelectItem>
                    <SelectItem value="salary">Salary Report</SelectItem>
                  </SelectContent>
                </Select>

                {reportType === "filtered" && (
                  <>
                    <Select
                      value={filterCriteria}
                      onValueChange={(value) =>
                        setFilterCriteria(value as FilterableFields)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select filter criteria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gender">Gender</SelectItem>
                        <SelectItem value="progLang">
                          Programming Language
                        </SelectItem>
                        <SelectItem value="importance">Importance</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterValue}
                      onValueChange={setFilterValue}
                      disabled={!filterCriteria}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select filter value" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterCriteria &&
                          FILTER_OPTIONS[filterCriteria].map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </>
                )}

                <Input
                  placeholder="Report author"
                  value={reportAuthor}
                  onChange={(e) => setReportAuthor(e.target.value)}
                  className="w-[180px]"
                />

                <Button onClick={generateReport}>Generate Report</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-4 flex justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => handleAction("UNDO")}>
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  Undo
                </Button>

                <Button variant="ghost" onClick={() => handleAction("REDO")}>
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  Redo
                </Button>

                <Button variant="ghost" onClick={() => handleAction("RESET")}>
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reset
                </Button>
              </div>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
