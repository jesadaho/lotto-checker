'use client';

import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface PurchaseItem {
  _id: string;
  price: number;
  createdAt: string;
}

interface SummaryItem {
  number: string;
  type: '2digit' | '3digit';
  total: number;
  limit?: number;
  exceeds: boolean;
  purchases: PurchaseItem[];
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<any>({});
  const toast = useRef<Toast>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/summary');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch summary');
      }
      
      setSummary(data.summary);
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load summary',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (purchaseId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this purchase?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await fetch(`/api/purchases?id=${purchaseId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete purchase');
          }

          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Purchase deleted successfully',
            life: 3000
          });

          await fetchSummary();
        } catch (err: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Failed to delete purchase',
            life: 3000
          });
        }
      }
    });
  };

  const handleResetAll = () => {
    confirmDialog({
      message: 'Are you sure you want to delete ALL purchases? This action cannot be undone.',
      header: 'Reset All Data',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          const response = await fetch('/api/purchases?all=true', {
            method: 'DELETE'
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete all purchases');
          }

          const data = await response.json();
          
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: `All purchases deleted successfully (${data.deletedCount} items)`,
            life: 3000
          });

          await fetchSummary();
        } catch (err: any) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Failed to delete all purchases',
            life: 3000
          });
        }
      }
    });
  };

  const statusBodyTemplate = (rowData: SummaryItem) => {
    if (rowData.exceeds) {
      return <Badge value="Exceeds Limit" severity="danger" />;
    } else if (rowData.limit !== undefined) {
      return <Badge value="Within Limit" severity="success" />;
    } else {
      return <Badge value="No Limit Set" severity="secondary" />;
    }
  };

  const totalBodyTemplate = (rowData: SummaryItem) => {
    return (
      <span className={rowData.exceeds ? 'text-red-600 font-semibold' : ''}>
        {rowData.total.toLocaleString()}
      </span>
    );
  };

  const limitBodyTemplate = (rowData: SummaryItem) => {
    return rowData.limit !== undefined 
      ? rowData.limit.toLocaleString() 
      : <span className="text-gray-400">No limit</span>;
  };

  const rowExpansionTemplate = (rowData: SummaryItem) => {
    return (
      <div className="p-4 bg-gray-50">
        <h5 className="mb-3 font-semibold">Purchase Details</h5>
        <DataTable value={rowData.purchases} size="small">
          <Column field="createdAt" header="Date" body={(row) => new Date(row.createdAt).toLocaleString()} />
          <Column field="price" header="Price" body={(row) => row.price.toLocaleString()} />
          <Column 
            header="Actions" 
            body={(row) => (
              <Button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                outlined
                onClick={() => handleDelete(row._id)}
              />
            )}
          />
        </DataTable>
      </div>
    );
  };

  const groupByType = (items: SummaryItem[]) => {
    const grouped: Record<string, SummaryItem[]> = {
      '2digit': [],
      '3digit': []
    };
    items.forEach(item => {
      grouped[item.type].push(item);
    });
    return grouped;
  };

  const grouped = groupByType(summary);

  const header2Digit = (
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold">2 Digit Numbers</span>
      <div className="flex">
        <Button
          icon="pi pi-refresh"
          label="Refresh"
          size="small"
          outlined
          onClick={fetchSummary}
        />
        {summary.length > 0 && (
          <Button
            icon="pi pi-trash"
            label="Reset All"
            severity="danger"
            size="small"
            outlined
            onClick={handleResetAll}
            className="ml-6"
          />
        )}
      </div>
    </div>
  );

  const header3Digit = (
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold">3 Digit Numbers</span>
      <div className="flex">
        <Button
          icon="pi pi-refresh"
          label="Refresh"
          size="small"
          outlined
          onClick={fetchSummary}
        />
        {summary.length > 0 && (
          <Button
            icon="pi pi-trash"
            label="Reset All"
            severity="danger"
            size="small"
            outlined
            onClick={handleResetAll}
            className="ml-6"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="py-8 px-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Purchase Summary</h2>
        <p className="text-gray-600">View all purchases and track limits</p>
      </div>

      {summary.length === 0 && !loading ? (
        <Card className="text-center py-12">
          <i className="pi pi-chart-bar text-6xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 text-lg">No purchases recorded yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start by adding purchases on the Input page</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped['2digit'].length > 0 && (
            <Card title={header2Digit} className="shadow-2">
              <DataTable
                value={grouped['2digit']}
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="number"
                emptyMessage="No 2-digit purchases found"
                rowClassName={(rowData) => rowData.exceeds ? 'bg-red-50' : ''}
              >
                <Column expander style={{ width: '3rem' }} />
                <Column field="number" header="Number" sortable />
                <Column 
                  field="total" 
                  header="Total Purchase" 
                  sortable 
                  body={totalBodyTemplate}
                />
                <Column 
                  field="limit" 
                  header="Limit" 
                  body={limitBodyTemplate}
                />
                <Column 
                  header="Status" 
                  body={statusBodyTemplate}
                />
              </DataTable>
            </Card>
          )}

          {grouped['3digit'].length > 0 && (
            <Card title={header3Digit} className="shadow-2">
              <DataTable
                value={grouped['3digit']}
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="number"
                emptyMessage="No 3-digit purchases found"
                rowClassName={(rowData) => rowData.exceeds ? 'bg-red-50' : ''}
              >
                <Column expander style={{ width: '3rem' }} />
                <Column field="number" header="Number" sortable />
                <Column 
                  field="total" 
                  header="Total Purchase" 
                  sortable 
                  body={totalBodyTemplate}
                />
                <Column 
                  field="limit" 
                  header="Limit" 
                  body={limitBodyTemplate}
                />
                <Column 
                  header="Status" 
                  body={statusBodyTemplate}
                />
              </DataTable>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
