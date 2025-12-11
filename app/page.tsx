'use client';

import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

export default function Home() {
  const [type, setType] = useState<'2digit' | '3digit'>('2digit');
  const [number, setNumber] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (price === null || price < 0 || price > 10000) {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Price must be between 0-10000',
          life: 3000
        });
        setLoading(false);
        return;
      }

      if (number === null) {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please enter a number',
          life: 3000
        });
        setLoading(false);
        return;
      }

      // Validate number based on type
      if (type === '2digit' && (number < 0 || number > 99)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Number must be between 00-99',
          life: 3000
        });
        setLoading(false);
        return;
      }
      if (type === '3digit' && (number < 0 || number > 999)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Number must be between 000-999',
          life: 3000
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: number.toString().padStart(type === '2digit' ? 2 : 3, '0'),
          type,
          price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create purchase');
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Purchase recorded successfully!',
        life: 3000
      });

      setNumber(null);
      setPrice(null);
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to create purchase',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enter Lotto Purchase</h2>
      <p className="text-gray-600">Record new lottery number purchases</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Toast ref={toast} />
      <Card header={header} className="shadow-2">
        <form onSubmit={handleSubmit} className="p-10">
          <div className="mb-12">
            <label className="block text-gray-700 text-sm font-medium mb-6">
              Lotto Type
            </label>
            <div className="flex gap-6">
              <div className="flex-1 flex items-center justify-center p-8 border-2 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <RadioButton
                  inputId="type2digit"
                  name="type"
                  value="2digit"
                  checked={type === '2digit'}
                  onChange={(e) => {
                    setType('2digit');
                    setNumber(null);
                  }}
                />
                <label htmlFor="type2digit" className="ml-4 font-medium cursor-pointer text-gray-700">
                  2 Digit (00-99)
                </label>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 border-2 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <RadioButton
                  inputId="type3digit"
                  name="type"
                  value="3digit"
                  checked={type === '3digit'}
                  onChange={(e) => {
                    setType('3digit');
                    setNumber(null);
                  }}
                />
                <label htmlFor="type3digit" className="ml-4 font-medium cursor-pointer text-gray-700">
                  3 Digit (000-999)
                </label>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <label htmlFor="number" className="block text-gray-700 text-sm font-medium mb-5">
              Number
            </label>
            <InputNumber
              id="number"
              value={number}
              onValueChange={(e) => setNumber(e.value)}
              min={0}
              max={type === '2digit' ? 99 : 999}
              placeholder={type === '2digit' ? '00-99' : '000-999'}
              className="w-full"
              required
            />
          </div>

          <div className="mb-12">
            <label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-5">
              Price (0-10000)
            </label>
            <InputNumber
              id="price"
              value={price}
              onValueChange={(e) => setPrice(e.value)}
              min={0}
              max={10000}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={2}
              placeholder="0-10000"
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-end pt-10 border-t border-gray-200 mt-10">
            <Button
              type="submit"
              label="Submit Purchase"
              icon="pi pi-check"
              loading={loading}
              className="min-w-[180px]"
              size="large"
            />
          </div>
        </form>
      </Card>
    </div>
  );
}
