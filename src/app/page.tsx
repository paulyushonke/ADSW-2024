import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function StudentInfo() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[600px] space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Architecture and Design of Software 2024
        </h1>
        <div className="space-y-4">
          <p className="text-center text-xl">Skuratovets Polina</p>
          <p className="text-center text-lg text-gray-600">KN-222b.e group</p>
        </div>
        <div className="flex justify-center space-x-4 pt-4">
          <Link href="/lab2">
            <Button variant="outline">Laboratory work 2</Button>
          </Link>
          <Link href="/lab3">
            <Button variant="outline">Laboratory work 3</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
