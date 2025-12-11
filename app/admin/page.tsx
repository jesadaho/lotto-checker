'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

interface Limit {
  _id: string;
  number: string;
  type: '2digit' | '3digit';
  limit: number;
}

export default function AdminPage() {
  const [type, setType] = useState<'2digit' | '3digit'>('2digit');
  const [number, setNumber] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState<Limit[]>([]);
  const [loadingLimits, setLoadingLimits] = useState(true);
  const toast = useRef<Toast>(null);

  const fetchLimits = async () => {
    try {
      setLoadingLimits(true);
      const response = await fetch('/api/limits');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch limits');
      }
      
      setLimits(data.limits);
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to fetch limits',
        life: 3000
      });
    } finally {
      setLoadingLimits(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (limit === null || limit < 0) {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Limit must be >= 0',
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

      const response = await fetch('/api/limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: number.toString().padStart(type === '2digit' ? 2 : 3, '0'),
          type,
          limit
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save limit');
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Limit saved successfully!',
        life: 3000
      });

      setNumber(null);
      setLimit(null);
      fetchLimits();
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to save limit',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (limitId: string, number: string, type: '2digit' | '3digit') => {
    confirmDialog({
      message: `Are you sure you want to delete the limit for ${number} (${type})?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await fetch(`/api/limits?number=${number}&type=${type}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete limit');
          }

          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Limit deleted successfully',
            life: 3000
          });

          fetchLimits();
        } catch (error: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to delete limit',
            life: 3000
          });
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: Limit) => {
    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        size="small"
        outlined
        onClick={() => handleDelete(rowData._id, rowData.number, rowData.type)}
      />
    );
  };

  const groupByType = (items: Limit[]) => {
    const grouped: Record<string, Limit[]> = {
      '2digit': [],
      '3digit': []
    };
    items.forEach(item => {
      grouped[item.type].push(item);
    });
    return grouped;
  };

  const grouped = groupByType(limits);

  const formHeader = (
    <div className="text-center py-2">
      <h3 className="text-xl font-semibold text-gray-900">Set Purchase Limits</h3>
      <p className="text-sm text-gray-600 mt-1">Configure purchase limits for lotto numbers</p>
    </div>
  );

  return (
    <div className="py-8 px-4 space-y-6">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Purchase Limits</h2>
        <p className="text-gray-600">Configure purchase limits for lotto numbers</p>
      </div>

      <Card header={formHeader} className="shadow-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-3">
              Lotto Type
            </label>
            <div className="flex gap-4">
              <div className="flex-1 flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
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
                <label htmlFor="type2digit" className="ml-2 font-medium cursor-pointer">
                  2 Digit (00-99)
                </label>
              </div>
              <div className="flex-1 flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
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
                <label htmlFor="type3digit" className="ml-2 font-medium cursor-pointer">
                  3 Digit (000-999)
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="number" className="block text-gray-700 text-sm font-medium mb-2">
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

          <div className="mb-6">
            <label htmlFor="limit" className="block text-gray-700 text-sm font-medium mb-2">
              Purchase Limit
            </label>
            <InputNumber
              id="limit"
              value={limit}
              onValueChange={(e) => setLimit(e.value)}
              min={0}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={2}
              placeholder="Enter limit amount"
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              label="Set Limit"
              icon="pi pi-check"
              loading={loading}
              className="min-w-[160px]"
            />
          </div>
        </form>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Limits</h3>
        {loadingLimits ? (
          <Card className="text-center py-12">
            <i className="pi pi-spin pi-spinner text-4xl text-primary mb-4"></i>
            <p className="text-gray-600">Loading limits...</p>
          </Card>
        ) : limits.length === 0 ? (
          <Card className="text-center py-12">
            <i className="pi pi-cog text-6xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 text-lg">No limits set yet.</p>
            <p className="text-gray-500 text-sm mt-2">Set your first limit using the form above</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {grouped['2digit'].length > 0 && (
              <Card title="2 Digit Numbers" className="shadow-2">
                <DataTable
                  value={grouped['2digit']}
                  loading={loadingLimits}
                  emptyMessage="No 2-digit limits found"
                >
                  <Column field="number" header="Number" sortable />
                  <Column 
                    field="limit" 
                    header="Limit" 
                    body={(row) => row.limit.toLocaleString()}
                    sortable
                  />
                  <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
              </Card>
            )}

            {grouped['3digit'].length > 0 && (
              <Card title="3 Digit Numbers" className="shadow-2">
                <DataTable
                  value={grouped['3digit']}
                  loading={loadingLimits}
                  emptyMessage="No 3-digit limits found"
                >
                  <Column field="number" header="Number" sortable />
                  <Column 
                    field="limit" 
                    header="Limit" 
                    body={(row) => row.limit.toLocaleString()}
                    sortable
                  />
                  <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
