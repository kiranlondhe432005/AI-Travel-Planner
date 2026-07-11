import PDFDocument from 'pdfkit';

/**
 * Generates a beautiful PDF of the travel plan and pipes it directly to the Express response stream.
 * @param {Object} trip - The trip document from MongoDB.
 * @param {Object} res - Express response stream.
 */
export const generatePDF = (trip, res) => {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true,
  });

  // Set response headers
  const safeFilename = trip.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="travel_plan_${safeFilename}.pdf"`
  );

  doc.pipe(res);

  const plan = trip.generatedPlan || {};

  // Theme colors
  const primaryColor = '#1e3a8a'; // Deep Navy
  const secondaryColor = '#4f46e5'; // Indigo
  const textColor = '#374151'; // Charcoal
  const lightGrey = '#f3f4f6'; // Light grey block
  const dividerColor = '#e5e7eb';

  // Helper to draw horizontal lines
  const drawLine = (y) => {
    doc.moveTo(50, y).lineTo(545, y).strokeColor(dividerColor).lineWidth(1).stroke();
  };

  // --- COVER PAGE / HEADER ---
  doc.fillColor(primaryColor).fontSize(28).font('Helvetica-Bold').text('AI TRAVEL PLANNER', { align: 'center' });
  doc.moveDown(0.2);
  doc.fillColor(secondaryColor).fontSize(14).font('Helvetica').text('Your Personalized Dream Vacation', { align: 'center' });
  doc.moveDown(1.5);

  // Big Destination Banner
  doc.fillColor('#ffffff');
  doc.rect(50, doc.y, 495, 60).fill(primaryColor);
  doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text(trip.destination.toUpperCase(), 70, doc.y + 18, { width: 455, align: 'center' });
  
  doc.y = 230; // reset y position after banner

  // Trip Metadata Grid
  doc.fillColor(textColor).fontSize(11).font('Helvetica-Bold');
  doc.text('Dates:', 60, doc.y);
  doc.font('Helvetica').text(
    `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`,
    130,
    doc.y
  );

  doc.font('Helvetica-Bold').text('Travellers:', 60, doc.y + 20);
  doc.font('Helvetica').text(`${trip.travellers} Person(s)`, 130, doc.y + 20);

  doc.font('Helvetica-Bold').text('Budget:', 300, doc.y);
  doc.font('Helvetica').text(
    trip.budget ? `${trip.budget.toLocaleString()} (Estimated)` : 'N/A',
    380,
    doc.y
  );

  doc.font('Helvetica-Bold').text('Trip Style:', 300, doc.y + 20);
  doc.font('Helvetica').text(trip.tripType, 380, doc.y + 20);

  doc.y = doc.y + 55;
  drawLine(doc.y);
  doc.moveDown(1);

  // Overview
  if (plan.overview) {
    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('Trip Overview');
    doc.moveDown(0.4);
    doc.fillColor(textColor).fontSize(10.5).font('Helvetica-Oblique').text(plan.overview, { lineGap: 4 });
    doc.moveDown(1.5);
  }

  // Country Info
  if (plan.countryInfo) {
    const ci = plan.countryInfo;
    doc.fillColor('#ffffff');
    doc.rect(50, doc.y, 495, 60).fill(lightGrey);
    
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('COUNTRY QUICK FACTS:', 70, doc.y - 45);
    doc.fillColor(textColor).fontSize(9.5).font('Helvetica');
    
    doc.text(`Capital: ${ci.capital || 'N/A'}`, 70, doc.y - 28);
    doc.text(`Currency: ${ci.currency || 'N/A'}`, 70, doc.y - 14);
    doc.text(`Languages: ${ci.languages || 'N/A'}`, 260, doc.y - 28);
    
    doc.y = doc.y + 10;
    doc.moveDown(1);
  }

  // Budget Breakdown
  if (plan.budgetBreakdown) {
    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('Estimated Budget Allocation');
    doc.moveDown(0.5);

    const bb = plan.budgetBreakdown;
    const categories = [
      { name: 'Accommodation', val: bb.accommodation },
      { name: 'Food & Dining', val: bb.food },
      { name: 'Activities & Sightseeing', val: bb.activities },
      { name: 'Transportation', val: bb.transport },
      { name: 'Miscellaneous', val: bb.misc },
    ];

    let rowY = doc.y;
    categories.forEach((cat) => {
      if (cat.val !== undefined && cat.val !== null) {
        doc.fillColor(textColor).fontSize(10).font('Helvetica').text(cat.name, 60, rowY);
        doc.font('Helvetica-Bold').text(
          typeof cat.val === 'number' ? `${cat.val.toLocaleString()}` : cat.val,
          350,
          rowY,
          { align: 'right', width: 100 }
        );
        rowY += 18;
      }
    });

    drawLine(rowY + 5);
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Total Cost Summary', 60, rowY + 12);
    doc.text(
      bb.total ? `${bb.total.toLocaleString()}` : (trip.budget ? `${trip.budget.toLocaleString()}` : 'N/A'),
      350,
      rowY + 12,
      { align: 'right', width: 100 }
    );

    doc.y = rowY + 35;
    doc.moveDown(1.5);
  }

  // --- DAY-BY-DAY ITINERARY ---
  if (plan.days && plan.days.length > 0) {
    doc.addPage();
    doc.fillColor(primaryColor).fontSize(18).font('Helvetica-Bold').text('Day-by-Day Itinerary', { align: 'center' });
    doc.moveDown(1);

    plan.days.forEach((day) => {
      // Check if we need a new page for the next day
      if (doc.y > 650) {
        doc.addPage();
      }

      doc.fillColor(secondaryColor).fontSize(12).font('Helvetica-Bold').text(`Day ${day.dayNumber}: ${day.theme || ''}`);
      doc.moveDown(0.4);

      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((act) => {
          if (doc.y > 700) {
            doc.addPage();
          }

          // Bullet points or nice blocks
          doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text(`[${act.time || 'All Day'}] ${act.title || ''}`, 70, doc.y);
          if (act.location) {
            doc.font('Helvetica-Oblique').fontSize(9).fillColor('#6b7280').text(`Location: ${act.location}`, 80, doc.y);
          }
          doc.font('Helvetica').fontSize(9.5).fillColor(textColor).text(act.description || '', 80, doc.y, { width: 450, lineGap: 2 });
          if (act.cost) {
            doc.font('Helvetica-Bold').fontSize(9).fillColor(secondaryColor).text(`Estimated Cost: ${typeof act.cost === 'number' ? act.cost.toLocaleString() : act.cost}`, 80, doc.y);
          }
          doc.moveDown(0.8);
        });
      }
      drawLine(doc.y);
      doc.moveDown(1);
    });
  }

  // --- HOTELS & RESTAURANTS ---
  if ((plan.hotels && plan.hotels.length > 0) || (plan.restaurants && plan.restaurants.length > 0)) {
    doc.addPage();
    doc.fillColor(primaryColor).fontSize(18).font('Helvetica-Bold').text('Recommendations', { align: 'center' });
    doc.moveDown(1);

    if (plan.hotels && plan.hotels.length > 0) {
      doc.fillColor(secondaryColor).fontSize(14).font('Helvetica-Bold').text('Recommended Accommodations');
      doc.moveDown(0.5);

      plan.hotels.forEach((hotel) => {
        if (doc.y > 700) doc.addPage();

        doc.fillColor(textColor).fontSize(10.5).font('Helvetica-Bold').text(hotel.name);
        doc.font('Helvetica-Oblique').fontSize(9).fillColor('#6b7280').text(`Rating: ${hotel.rating || 'N/A'}  |  Price: ${hotel.priceRange || 'N/A'}`);
        doc.font('Helvetica').fontSize(9.5).fillColor(textColor).text(hotel.description || '');
        if (hotel.address) {
          doc.font('Helvetica').fontSize(9).fillColor('#4b5563').text(`Address: ${hotel.address}`);
        }
        doc.moveDown(1);
      });
      drawLine(doc.y);
      doc.moveDown(1);
    }

    if (plan.restaurants && plan.restaurants.length > 0) {
      if (doc.y > 600) doc.addPage();
      
      doc.fillColor(secondaryColor).fontSize(14).font('Helvetica-Bold').text('Recommended Dining & Restaurants');
      doc.moveDown(0.5);

      plan.restaurants.forEach((rest) => {
        if (doc.y > 700) doc.addPage();

        doc.fillColor(textColor).fontSize(10.5).font('Helvetica-Bold').text(rest.name);
        doc.font('Helvetica-Oblique').fontSize(9).fillColor('#6b7280').text(`Cuisine: ${rest.cuisine || 'N/A'}  |  Price: ${rest.priceRange || 'N/A'}`);
        doc.font('Helvetica').fontSize(9.5).fillColor(textColor).text(rest.description || '');
        if (rest.address) {
          doc.font('Helvetica').fontSize(9).fillColor('#4b5563').text(`Address: ${rest.address}`);
        }
        doc.moveDown(1);
      });
      drawLine(doc.y);
      doc.moveDown(1);
    }
  }

  // --- PACKING LIST & SAFETY TIPS ---
  if ((plan.packingList && plan.packingList.length > 0) || (plan.safetyTips && plan.safetyTips.length > 0)) {
    if (doc.y > 550) doc.addPage();
    else doc.moveDown(1);

    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('Preparation & Guidelines');
    doc.moveDown(0.5);

    let listY = doc.y;

    if (plan.packingList && plan.packingList.length > 0) {
      doc.fillColor(secondaryColor).fontSize(11).font('Helvetica-Bold').text('Recommended Packing List', 50, listY);
      doc.fillColor(textColor).fontSize(9.5).font('Helvetica');
      let itemY = listY + 20;
      plan.packingList.forEach((item) => {
        if (itemY > 750) {
          doc.addPage();
          itemY = 50;
        }
        doc.text(`- ${item}`, 60, itemY);
        itemY += 15;
      });
      doc.y = itemY;
    }

    if (plan.safetyTips && plan.safetyTips.length > 0) {
      const colX = plan.packingList && plan.packingList.length > 0 ? 300 : 50;
      doc.fillColor(secondaryColor).fontSize(11).font('Helvetica-Bold').text('Travel Safety Tips', colX, listY);
      doc.fillColor(textColor).fontSize(9.5).font('Helvetica');
      let itemY = listY + 20;
      plan.safetyTips.forEach((tip) => {
        if (itemY > 750) {
          doc.addPage();
          itemY = 50;
        }
        doc.text(`- ${tip}`, colX + 10, itemY, { width: 230 });
        itemY += doc.heightOfString(`- ${tip}`, { width: 230 }) + 5;
      });
      doc.y = Math.max(doc.y, itemY);
    }
  }

  // --- FOOTER AND PAGE NUMBERING ---
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Header (skip cover page header if needed, but since we are simple, draw on all)
    doc.fontSize(8).fillColor('#9ca3af').text('AI Travel Planner - Generated on the go', 50, 20, { align: 'left' });
    drawLine(30);

    // Footer
    drawLine(780);
    doc.fontSize(8).fillColor('#9ca3af').text(`Page ${i + 1} of ${range.count}`, 50, 790, { align: 'center' });
  }

  doc.end();
};
