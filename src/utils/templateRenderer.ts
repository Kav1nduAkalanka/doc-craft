import type { LayoutState } from '../types';

export function renderTemplate(
  templateId: string,
  data: Record<string, any>,
  layoutState: LayoutState | null,
  accentColor: string,
  documentType: string = 'invoice'
): string {
  data = data || {};
  // Extract data
  const lineItems = (data.lineItems as Array<{ description: string; quantity: number; unitPrice: number; total: number }>) || [];
  const subtotal = (data.subtotal as number) || lineItems.reduce((s, i) => s + (i.total || 0), 0);
  const taxRate = (data.taxRate as number) || 0;
  const taxAmount = (data.taxAmount as number) || subtotal * (taxRate / 100);
  const totalDue = (data.totalDue as number) || subtotal + taxAmount;
  const currency = data.currency || '$';

  // Extract layout settings
  const showLogo = layoutState?.showLogo ?? false;
  const logoUrl = layoutState?.logoUrl || '';
  const showNotes = layoutState?.showNotes ?? true;
  const sectionOrder = layoutState?.sectionOrder || ['header', 'client_details', 'line_items', 'total', 'notes'];

  // Formatting helper
  const applyFormatting = (html: string, size: any, bold: any) => {
    let result = html;
    if (size === 'small') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 0.9)}px`);
    } else if (size === 'large') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 1.15)}px`);
    }
    if (bold) {
      result = result.replace(/font-weight:\s*500/g, 'font-weight: 600');
      result = result.replace(/font-weight:\s*600/g, 'font-weight: 700');
      result = result.replace(/font-weight:\s*700/g, 'font-weight: 800');
      result = `<div style="font-weight: 500;">${result}</div>`;
    }
    return result;
  };

  // Apply template styles
  let fontFamily = "'Inter', sans-serif";
  let borderStyle = `border-bottom: 2px solid ${accentColor};`;
  let tableHeaderBg = 'transparent';
  let headerTitleColor = accentColor;
  let accentBorder = `border-top: 2px solid ${accentColor}; border-bottom: 2px solid ${accentColor};`;
  
  if (templateId?.includes('_minimal')) {
    fontFamily = "'Roboto', sans-serif";
    borderStyle = 'border-bottom: 1px solid #e2e8f0;';
    tableHeaderBg = '#f8fafc';
    headerTitleColor = '#1e293b';
    accentBorder = `border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;`;
  } else if (templateId?.includes('_classic')) {
    fontFamily = "'Times New Roman', serif";
    borderStyle = `border-bottom: 3px double ${accentColor};`;
    tableHeaderBg = `${accentColor}15`;
    accentBorder = `border-top: 3px double ${accentColor}; border-bottom: 3px double ${accentColor};`;
  }

  // Override with custom typography if set
  if (layoutState?.fontFamily && layoutState.fontFamily !== 'default') {
    fontFamily = layoutState.fontFamily;
  }

  // Determine document specifics
  const isQuotation = documentType === 'quotation';
  const isReceipt = documentType === 'receipt';
  const isProposal = documentType === 'proposal';
  const isPurchaseOrder = documentType === 'purchase_order';
  
  const docTitle = isQuotation ? 'QUOTATION' : isReceipt ? 'RECEIPT' : isProposal ? 'PROPOSAL' : isPurchaseOrder ? 'PURCHASE ORDER' : 'INVOICE';
  const docNumber = isQuotation 
    ? (data.quotationNumber || data.quoteNumber || 'QT-0001') 
    : isReceipt 
      ? (data.receiptNumber || 'RCP-0001') 
      : isProposal
        ? (data.proposalNumber || 'PRP-0001')
        : isPurchaseOrder
          ? (data.poNumber || 'PO-0001')
          : (data.invoiceNumber || 'INV-0001');

  const totalLabel = isReceipt ? 'Amount Paid' : 'Total Due';

  const sections: Record<string, string> = {
    header: applyFormatting(`
      <!-- Header -->
      <div style="display: flex; justify-content: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'center' ? 'center' : (layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'flex-end' : 'space-between'}; margin-bottom: 40px; align-items: flex-start; text-align: ${layoutState?.header_alignment || layoutState?.headerAlignment || 'left'}; flex-direction: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'row-reverse' : 'row'};">
        <div style="flex: 1;">
          ${showLogo && logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 16px;" />` : ''}
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Business Details</p>
          <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px 0;">${data.businessName || 'Your business'}</h1>
          <p style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0;">${data.senderAddress || '123 Main St, City'}</p>
          <p style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0;">${data.senderPhone || '+94 77 000 0000'}</p>
          <p style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0;">${data.senderEmail || 'you@business.com'}</p>
        </div>
        
        <div style="text-align: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'left' : 'right'};">
          <h2 style="font-size: 36px; font-weight: 800; color: ${headerTitleColor}; margin: 0 0 16px 0; letter-spacing: -0.02em;">${docTitle}</h2>
          
          <div style="display: flex; gap: 24px; justify-content: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'flex-start' : 'flex-end'}; text-align: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'left' : 'right'};">
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">${isQuotation ? 'Quote No.' : isProposal ? 'Proposal No.' : isPurchaseOrder ? 'PO No.' : 'Invoice No.'}</p>
              <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">${docNumber}</p>
            </div>
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Date</p>
              <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">${data.issueDate || '—'}</p>
            </div>
            ${!isReceipt && !isPurchaseOrder ? `
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">${isQuotation || isProposal ? 'Valid Until' : 'Due Date'}</p>
              <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">${data.dueDate || data.validUntil || '—'}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `, layoutState?.header_fontSize || layoutState?.fontSize, layoutState?.header_bold || layoutState?.bold),
    client_details: (layoutState?.showClientDetails ?? true) ? applyFormatting(`
      <!-- Client Details & Config -->
      <div style="display: flex; margin-bottom: 40px; gap: 40px; text-align: ${layoutState?.client_details_alignment || 'left'}; flex-direction: ${layoutState?.client_details_alignment === 'right' ? 'row-reverse' : 'row'};">
        <!-- Left: Client Info -->
        <div style="flex: 1;">
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">${isQuotation || isProposal ? 'Prepared For' : 'Bill To'}</p>
          
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Client Name</p>
            <p style="font-size: 14px; font-weight: 500; color: #111827; margin: 0;">${data.clientName || 'Client or company'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Email</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.clientEmail || 'client@email.com'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Address</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.clientAddress || 'Client address'}</p>
          </div>
        </div>

        <!-- Right: Payment/Scope Details -->
        <div style="flex: 1;">
          ${isQuotation || isProposal ? `
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Scope & Delivery</p>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Project / Scope Title</p>
            <p style="font-size: 14px; font-weight: 500; color: #111827; margin: 0;">${data.projectScope || 'e.g. Website Redesign'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Estimated Delivery</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.estimatedDelivery || 'e.g. 4 weeks'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Payment Terms</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.paymentTerms || 'e.g. 50% upfront'}</p>
          </div>
          ` : isPurchaseOrder ? `
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Order Details</p>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Project / Scope Title</p>
            <p style="font-size: 14px; font-weight: 500; color: #111827; margin: 0;">${data.projectScope || '—'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Estimated Delivery</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.estimatedDelivery || '—'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Payment Terms</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.paymentTerms || '—'}</p>
          </div>
          ` : `
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Payment Details</p>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Bank Name</p>
            <p style="font-size: 14px; font-weight: 500; color: #111827; margin: 0;">${data.bankName || 'e.g. Sampath Bank'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Account Number</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.accountNumber || '000-0000-0000'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Account Name</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">${data.accountName || 'Account holder name'}</p>
          </div>
          `}
        </div>
      </div>
    `, layoutState?.client_details_fontSize || layoutState?.fontSize, layoutState?.client_details_bold || layoutState?.bold) : '',
    line_items: applyFormatting(`
      <!-- Line Items -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        <thead style="background: ${tableHeaderBg};">
          <tr style="${borderStyle}">
            <th style="text-align: left; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700;">Description</th>
            ${(layoutState?.showQuantityColumn ?? true) ? `<th style="text-align: center; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700; width: 10%;">Qty</th>` : ''}
            <th style="text-align: right; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700; width: 20%;">Unit Price</th>
            <th style="text-align: right; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700; width: 20%;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map((item, i) => `
            <tr style="border-bottom: 1px solid #f3f4f6; ${i % 2 === 1 && !templateId?.includes('_minimal') ? 'background: #fafbfc;' : ''}">
              <td style="padding: 16px 8px; font-size: 14px; color: #111827; font-weight: 500;">${item.description}</td>
              ${(layoutState?.showQuantityColumn ?? true) ? `<td style="padding: 16px 8px; font-size: 14px; color: #4b5563; text-align: center;">${item.quantity}</td>` : ''}
              <td style="padding: 16px 8px; font-size: 14px; color: #4b5563; text-align: right;">${currency}${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 16px 8px; font-size: 14px; color: #111827; font-weight: 600; text-align: right;">${currency}${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `, layoutState?.fontSize, layoutState?.bold),
    total: applyFormatting(`
      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 48px;">
        <div style="width: 320px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4b5563;">
            <span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span>
          </div>
          ${taxRate > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4b5563;">
            <span>Tax / VAT (${taxRate}%)</span><span>${currency}${taxAmount.toFixed(2)}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; padding: 16px 0; font-size: 16px; font-weight: 700; color: ${headerTitleColor}; ${accentBorder}; margin-top: 8px;">
            <span>${isQuotation || isProposal ? 'Quoted Total' : totalLabel}</span><span>${currency}${totalDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `, layoutState?.total_fontSize || layoutState?.fontSize, layoutState?.total_bold || layoutState?.bold),
    notes: showNotes ? applyFormatting(`
      <!-- Notes -->
      <div style="margin-bottom: 32px;">
        <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Notes, Exclusions & Terms</p>
        <div style="padding: 16px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px;">
          <p style="font-size: 13px; color: #4b5563; margin: 0; line-height: 1.6;">${data.notesAndTerms || 'e.g. Payment due within 30 days. Thank you for your business.'}</p>
        </div>
      </div>
      ${isQuotation || isProposal ? `
      <div style="margin-top: 48px; padding: 24px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px;">
        <p style="font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px 0;">Acceptance Section</p>
        <p style="font-size: 11px; color: #6b7280; margin: 0 0 24px 0;">To accept this ${isQuotation ? 'quotation' : 'proposal'}, client fills and signs below</p>
        
        <div style="display: flex; gap: 24px;">
          <div style="flex: 1;">
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px 0;">Authorized Name</p>
            <div style="border-bottom: 1px solid #d1d5db; height: 24px;"></div>
          </div>
          <div style="flex: 1;">
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px 0;">Signature</p>
            <div style="border-bottom: 1px solid #d1d5db; height: 24px;"></div>
          </div>
          <div style="flex: 1;">
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px 0;">Date of Acceptance</p>
            <div style="border-bottom: 1px solid #d1d5db; height: 24px;"></div>
          </div>
        </div>
      </div>
      ` : ''}
    `, layoutState?.notes_fontSize || layoutState?.fontSize, layoutState?.notes_bold || layoutState?.bold) : ''
  };

  const footer = `
    <!-- Footer -->
    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #e2e8f0; margin-top: 16px;">
      <p style="font-size: 10px; color: #cbd5e1;">Generated with DocCraft · doccraft.app</p>
    </div>
  `;

  // Render ordered sections
  const renderedSections = sectionOrder.map(id => sections[id] || '').join('\n');

  return `
    <div style="font-family: ${fontFamily}; color: #1e293b; padding: 24px 12px; background: white; min-height: 100%;">
      ${renderedSections}
      ${footer}
    </div>
  `;
}

export function renderTemplateSections(
  templateId: string,
  data: Record<string, any>,
  layoutState: LayoutState | null,
  accentColor: string,
  documentType: string = 'invoice'
): Record<string, string> {
  data = data || {};
  // Extract data
  const lineItems = (data.lineItems as Array<{ description: string; quantity: number; unitPrice: number; total: number }>) || [];
  const subtotal = (data.subtotal as number) || lineItems.reduce((s, i) => s + (i.total || 0), 0);
  const taxRate = (data.taxRate as number) || 0;
  const taxAmount = (data.taxAmount as number) || subtotal * (taxRate / 100);
  const totalDue = (data.totalDue as number) || subtotal + taxAmount;
  const currency = data.currency || '$';

  // Extract layout settings
  const showLogo = layoutState?.showLogo ?? false;
  const logoUrl = layoutState?.logoUrl || '';
  const showNotes = layoutState?.showNotes ?? true;

  // Formatting helper
  const applyFormatting = (html: string, size: any, bold: any) => {
    let result = html;
    if (size === 'small') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 0.9)}px`);
    } else if (size === 'large') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 1.15)}px`);
    }
    if (bold) {
      result = result.replace(/font-weight:\s*500/g, 'font-weight: 600');
      result = result.replace(/font-weight:\s*600/g, 'font-weight: 700');
      result = result.replace(/font-weight:\s*700/g, 'font-weight: 800');
      result = `<div style="font-weight: 500;">${result}</div>`;
    }
    return result;
  };

  // Apply template styles
  let borderStyle = `border-bottom: 2px solid ${accentColor};`;
  let tableHeaderBg = 'transparent';
  let headerTitleColor = accentColor;
  let accentBorder = `border-top: 2px solid ${accentColor}; border-bottom: 2px solid ${accentColor};`;
  
  if (templateId?.includes('_minimal')) {
    borderStyle = 'border-bottom: 1px solid #e2e8f0;';
    tableHeaderBg = '#f8fafc';
    headerTitleColor = '#1e293b';
    accentBorder = `border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;`;
  } else if (templateId?.includes('_classic')) {
    borderStyle = `border-bottom: 3px double ${accentColor};`;
    tableHeaderBg = `${accentColor}15`;
    accentBorder = `border-top: 3px double ${accentColor}; border-bottom: 3px double ${accentColor};`;
  }

  // Override with custom typography if set
  // (fontFamily is applied by DocumentPreview wrapping container)

  const isQuotation = documentType === 'quotation';
  const isReceipt = documentType === 'receipt';
  const isProposal = documentType === 'proposal';
  const isPurchaseOrder = documentType === 'purchase_order';
  
  const docTitle = isQuotation ? 'QUOTATION' : isReceipt ? 'RECEIPT' : isProposal ? 'PROPOSAL' : isPurchaseOrder ? 'PURCHASE ORDER' : 'INVOICE';
  const docNumber = isQuotation 
    ? (data.quotationNumber || data.quoteNumber || 'QT-0001') 
    : isReceipt 
      ? (data.receiptNumber || 'RCP-0001') 
      : isProposal
        ? (data.proposalNumber || 'PRP-0001')
        : isPurchaseOrder
          ? (data.poNumber || 'PO-0001')
          : (data.invoiceNumber || 'INV-0001');

  const docNumberSlot = isQuotation ? 'quoteNumber' : isReceipt ? 'receiptNumber' : isProposal ? 'proposalNumber' : isPurchaseOrder ? 'poNumber' : 'invoiceNumber';

  const totalLabel = isReceipt ? 'Amount Paid' : 'Total Due';

  const sections: Record<string, string> = {
    header: applyFormatting(`
      <div style="display: flex; justify-content: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'center' ? 'center' : (layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'flex-end' : 'space-between'}; margin-bottom: 40px; align-items: flex-start; text-align: ${layoutState?.header_alignment || layoutState?.headerAlignment || 'left'}; flex-direction: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'row-reverse' : 'row'};">
        <div style="flex: 1;">
          ${showLogo && logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 16px;" />` : ''}
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Business Details</p>
          <h1 contenteditable="true" data-slot="businessName" style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px 0; outline: none;">${data.businessName || 'Your business'}</h1>
          <p contenteditable="true" data-slot="senderAddress" style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0; outline: none;">${data.senderAddress || '123 Main St, City'}</p>
          <p contenteditable="true" data-slot="senderPhone" style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0; outline: none;">${data.senderPhone || '+94 77 000 0000'}</p>
          <p contenteditable="true" data-slot="senderEmail" style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0; outline: none;">${data.senderEmail || 'you@business.com'}</p>
        </div>
        
        <div style="text-align: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'left' : 'right'};">
          <h2 style="font-size: 36px; font-weight: 800; color: ${headerTitleColor}; margin: 0 0 16px 0; letter-spacing: -0.02em;">${docTitle}</h2>
          
          <div style="display: flex; gap: 24px; justify-content: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'flex-start' : 'flex-end'}; text-align: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'left' : 'right'};">
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">${isQuotation ? 'Quote No.' : isProposal ? 'Proposal No.' : isPurchaseOrder ? 'PO No.' : 'Invoice No.'}</p>
              <p contenteditable="true" data-slot="${docNumberSlot}" style="font-size: 14px; font-weight: 600; color: #111827; margin: 0; outline:none;">${docNumber}</p>
            </div>
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Date</p>
              <p contenteditable="true" data-slot="issueDate" style="font-size: 14px; font-weight: 600; color: #111827; margin: 0; outline:none;">${data.issueDate || '—'}</p>
            </div>
            ${!isReceipt && !isPurchaseOrder ? `
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">${isQuotation || isProposal ? 'Valid Until' : 'Due Date'}</p>
              <p contenteditable="true" data-slot="${isQuotation || isProposal ? 'validUntil' : 'dueDate'}" style="font-size: 14px; font-weight: 600; color: #111827; margin: 0; outline:none;">${data.dueDate || data.validUntil || '—'}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `, layoutState?.header_fontSize || layoutState?.fontSize, layoutState?.header_bold || layoutState?.bold),
    client_details: (layoutState?.showClientDetails ?? true) ? applyFormatting(`
      <div style="display: flex; margin-bottom: 40px; gap: 40px; text-align: ${layoutState?.client_details_alignment || 'left'}; flex-direction: ${layoutState?.client_details_alignment === 'right' ? 'row-reverse' : 'row'};">
        <div style="flex: 1;">
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">${isQuotation || isProposal ? 'Prepared For' : 'Bill To'}</p>
          
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Client Name</p>
            <p contenteditable="true" data-slot="clientName" style="font-size: 14px; font-weight: 500; color: #111827; margin: 0; outline:none;">${data.clientName || 'Client or company'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Email</p>
            <p contenteditable="true" data-slot="clientEmail" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.clientEmail || 'client@email.com'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Address</p>
            <p contenteditable="true" data-slot="clientAddress" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.clientAddress || 'Client address'}</p>
          </div>
        </div>

        <div style="flex: 1;">
          ${isQuotation || isProposal ? `
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Scope & Delivery</p>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Project / Scope Title</p>
            <p contenteditable="true" data-slot="projectScope" style="font-size: 14px; font-weight: 500; color: #111827; margin: 0; outline:none;">${data.projectScope || 'e.g. Website Redesign'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Estimated Delivery</p>
            <p contenteditable="true" data-slot="estimatedDelivery" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.estimatedDelivery || 'e.g. 4 weeks'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Payment Terms</p>
            <p contenteditable="true" data-slot="paymentTerms" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.paymentTerms || 'e.g. 50% upfront'}</p>
          </div>
          ` : isPurchaseOrder ? `
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Order Details</p>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Project / Scope Title</p>
            <p contenteditable="true" data-slot="projectScope" style="font-size: 14px; font-weight: 500; color: #111827; margin: 0; outline:none;">${data.projectScope || '—'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Estimated Delivery</p>
            <p contenteditable="true" data-slot="estimatedDelivery" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.estimatedDelivery || '—'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Payment Terms</p>
            <p contenteditable="true" data-slot="paymentTerms" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.paymentTerms || '—'}</p>
          </div>
          ` : `
          <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Payment Details</p>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Bank Name</p>
            <p contenteditable="true" data-slot="bankName" style="font-size: 14px; font-weight: 500; color: #111827; margin: 0; outline:none;">${data.bankName || 'e.g. Sampath Bank'}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Account Number</p>
            <p contenteditable="true" data-slot="accountNumber" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.accountNumber || '000-0000-0000'}</p>
          </div>
          <div>
            <p style="font-size: 10px; font-weight: 600; color: #6b7280; margin: 0 0 2px 0;">Account Name</p>
            <p contenteditable="true" data-slot="accountName" style="font-size: 14px; color: #4b5563; margin: 0; outline:none;">${data.accountName || 'Account holder name'}</p>
          </div>
          `}
        </div>
      </div>
    `, layoutState?.client_details_fontSize || layoutState?.fontSize, layoutState?.client_details_bold || layoutState?.bold) : '',
    line_items: applyFormatting(`
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        <thead style="background: ${tableHeaderBg};">
          <tr style="${borderStyle}">
            <th style="text-align: left; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700;">Description</th>
            ${(layoutState?.showQuantityColumn ?? true) ? `<th style="text-align: center; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700; width: 10%;">Qty</th>` : ''}
            <th style="text-align: right; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700; width: 20%;">Unit Price</th>
            <th style="text-align: right; padding: 12px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 700; width: 20%;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map((item, i) => `
            <tr style="border-bottom: 1px solid #f3f4f6; ${i % 2 === 1 && !templateId?.includes('_minimal') ? 'background: #fafbfc;' : ''}">
              <td style="padding: 16px 8px; font-size: 14px; color: #111827; font-weight: 500;">${item.description}</td>
              ${(layoutState?.showQuantityColumn ?? true) ? `<td style="padding: 16px 8px; font-size: 14px; color: #4b5563; text-align: center;">${item.quantity}</td>` : ''}
              <td style="padding: 16px 8px; font-size: 14px; color: #4b5563; text-align: right;">${currency}${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 16px 8px; font-size: 14px; color: #111827; font-weight: 600; text-align: right;">${currency}${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `, layoutState?.fontSize, layoutState?.bold),
    total: applyFormatting(`
      <div style="display: flex; justify-content: flex-end; margin-bottom: 48px;">
        <div style="width: 320px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4b5563;">
            <span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span>
          </div>
          ${taxRate > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4b5563;">
            <span>Tax / VAT (<span contenteditable="true" data-slot="taxRate" style="outline:none;">${taxRate}</span>%)</span><span>${currency}${taxAmount.toFixed(2)}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; padding: 16px 0; font-size: 16px; font-weight: 700; color: ${headerTitleColor}; ${accentBorder}; margin-top: 8px;">
            <span>${isQuotation || isProposal ? 'Quoted Total' : totalLabel}</span><span>${currency}${totalDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `, layoutState?.total_fontSize || layoutState?.fontSize, layoutState?.total_bold || layoutState?.bold),
    notes: showNotes ? applyFormatting(`
      <div style="margin-bottom: 32px;">
        <p style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Notes, Exclusions & Terms</p>
        <div style="padding: 16px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px;">
          <p contenteditable="true" data-slot="notesAndTerms" style="font-size: 13px; color: #4b5563; margin: 0; line-height: 1.6; outline:none;">${data.notesAndTerms || 'e.g. Payment due within 30 days. Thank you for your business.'}</p>
        </div>
      </div>
      ${isQuotation || isProposal ? `
      <div style="margin-top: 48px; padding: 24px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px;">
        <p style="font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px 0;">Acceptance Section</p>
        <p style="font-size: 11px; color: #6b7280; margin: 0 0 24px 0;">To accept this ${isQuotation ? 'quotation' : 'proposal'}, client fills and signs below</p>
        
        <div style="display: flex; gap: 24px;">
          <div style="flex: 1;">
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px 0;">Authorized Name</p>
            <div style="border-bottom: 1px solid #d1d5db; height: 24px;"></div>
          </div>
          <div style="flex: 1;">
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px 0;">Signature</p>
            <div style="border-bottom: 1px solid #d1d5db; height: 24px;"></div>
          </div>
          <div style="flex: 1;">
            <p style="font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin: 0 0 8px 0;">Date of Acceptance</p>
            <div style="border-bottom: 1px solid #d1d5db; height: 24px;"></div>
          </div>
        </div>
      </div>
      ` : ''}
    `, layoutState?.notes_fontSize || layoutState?.fontSize, layoutState?.notes_bold || layoutState?.bold) : ''
  };

  return sections;
}
