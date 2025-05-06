import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'Data_JSON', 'data.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(data);
  return NextResponse.json(jsonData.products.data.products);
}