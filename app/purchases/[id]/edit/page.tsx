export const dynamic = 'force-dynamic';

import { PurchaseForm } from '@/components/PurchaseForm';
import { getPurchaseForEdit } from '@/lib/spending';
import { notFound } from 'next/navigation';

export default async function EditPurchasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchase = await getPurchaseForEdit(id);

  if (!purchase) notFound();

  return <PurchaseForm mode="edit" purchase={purchase} />;
}
