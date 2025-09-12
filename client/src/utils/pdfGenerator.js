import jsPDF from 'jspdf';

// Generate comprehensive PDF report with professional dashboards
export const generateStatisticsPDF = async (statistics, containerRef) => {
  try {
    // Validate and sanitize statistics data
    const safeStatistics = {
      totalProducts: statistics.totalProducts || 0,
      totalOrders: statistics.totalOrders || 0,
      totalRevenue: statistics.totalRevenue ? parseFloat(statistics.totalRevenue) : 0,
      pendingOrders: statistics.pendingOrders || 0,
      productsOnSale: statistics.productsOnSale || 0,
      lowStockItems: statistics.lowStockItems || 0,
      averageOrderValue: statistics.averageOrderValue ? parseFloat(statistics.averageOrderValue) : 0,
      stockTurnoverRate: statistics.stockTurnoverRate ? parseFloat(statistics.stockTurnoverRate) : 0,
      salePercentage: statistics.salePercentage ? parseFloat(statistics.salePercentage) : 0,
      stockStatus: statistics.stockStatus || { high: 0, medium: 0, low: 0, out: 0 },
      topSellingProducts: statistics.topSellingProducts || [],
      lowStockProducts: statistics.lowStockProducts || [],
      saleProducts: statistics.saleProducts || [],
      orderStatusDistribution: statistics.orderStatusDistribution || { pending: 0, confirmed: 0, processing: 0, ready: 0, completed: 0, cancelled: 0 },
      categoryStats: statistics.categoryStats || []
    };

    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add text with word wrapping and alignment support
    const addText = (text, x, y, maxWidth, fontSize = 12, fontStyle = 'normal', color = [0, 0, 0], align = 'left') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(color[0], color[1], color[2]);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y, { align: align });
      return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to add a line (currently unused but available for future use)
    // const addLine = (x1, y1, x2, y2, color = [0, 0, 0], width = 0.5) => {
    //   pdf.setDrawColor(color[0], color[1], color[2]);
    //   pdf.setLineWidth(width);
    //   pdf.line(x1, y1, x2, y2);
    // };

    // Helper function to add a rectangle
    const addRect = (x, y, width, height, fillColor = null, strokeColor = [0, 0, 0]) => {
      if (fillColor) {
        pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        pdf.rect(x, y, width, height, 'F');
      }
      pdf.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
      pdf.rect(x, y, width, height);
    };

    // Helper function to add a circle
    const addCircle = (x, y, radius, fillColor = null, strokeColor = [0, 0, 0]) => {
      if (fillColor) {
        pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        pdf.circle(x, y, radius, 'F');
      }
      pdf.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
      pdf.circle(x, y, radius);
    };

    // Helper function to create a professional dashboard card with perfect alignment
    const addDashboardCard = (title, value, subtitle, x, y, width, height, color = [16, 185, 129]) => {
      // Card background with gradient effect
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x, y, width, height, 'F');
      
      // Card border
      addRect(x, y, width, height, null, [200, 200, 200]);
      
      // Top accent line
      addRect(x, y, width, 3, color);
      
      // Title - moved down to avoid overlap
      addText(title, x + 10, y + 18, width - 20, 11, 'bold', [100, 100, 100]);
      
      // Main value - moved down
      addText(value.toString(), x + 10, y + 32, width - 20, 18, 'bold', color);
      
      // Subtitle - moved down and reduced font size
      if (subtitle) {
        addText(subtitle, x + 10, y + 48, width - 20, 9, 'normal', [150, 150, 150]);
      }
    };


    // Helper function to create a professional bar chart
    const addBarChart = (data, x, y, width, height, title) => {
      const maxValue = Math.max(...data.map(item => item.value));
      const barWidth = (width - 50) / data.length;
      const chartHeight = height - 50;
      
      // Professional chart title
      addText(title, x, y - 15, width, 11, 'bold', [15, 23, 42]);
      
      // Draw professional bars with gradients
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const barX = x + 25 + (index * barWidth);
        const barY = y + chartHeight - barHeight;
        
        // Draw bar with professional styling
        addRect(barX, barY, barWidth - 3, barHeight, item.color);
        
        // Add subtle border
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.5);
        pdf.rect(barX, barY, barWidth - 3, barHeight);
        
        // Add professional value label
        addText(item.value.toString(), barX + (barWidth/2) - 8, barY - 8, 16, 7, 'bold', [15, 23, 42]);
        
        // Add professional category label
        addText(item.label, barX + (barWidth/2) - 12, y + chartHeight + 15, 24, 7, 'normal', [75, 85, 99]);
      });
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Professional Header with Statistics Theme - Perfectly Aligned (matching AI Analytics)
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    // Logo and Title with precise positioning (left-aligned like AI Analytics)
    addText('🌿 CANNA BOMB', 20, 18, 120, 22, 'bold', [255, 255, 255]);
    addText('EXECUTIVE ANALYTICS REPORT', 20, 28, 120, 16, 'bold', [255, 255, 255]);
    addText('Strategic Business Intelligence & Performance Metrics', 20, 36, 120, 11, 'normal', [200, 200, 200]);
    
    // Timestamp with right alignment (matching AI Analytics)
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    addText(`Generated: ${timestamp}`, pageWidth - 20, 28, 60, 10, 'normal', [255, 255, 255], 'right');
    
    yPosition = 55;
    pdf.setTextColor(0, 0, 0);

    // Executive Dashboard - Key Performance Indicators with premium styling
    addText('EXECUTIVE DASHBOARD', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    
    // Add executive subtitle
    addText('Key Performance Indicators & Strategic Metrics', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    // Create executive-level KPI cards with premium spacing
    const cardWidth = (pageWidth - 70) / 3;
    const cardHeight = 65;
    const cardSpacing = 15;
    
    // Row 1: Primary KPIs with executive spacing
    addDashboardCard(
      'TOTAL PRODUCTS', 
      safeStatistics.totalProducts, 
      'Active inventory items', 
      20, yPosition, cardWidth, cardHeight, [16, 185, 129]
    );
    
    addDashboardCard(
      'TOTAL ORDERS', 
      safeStatistics.totalOrders, 
      'All-time orders placed', 
      20 + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, [59, 130, 246]
    );
    
    addDashboardCard(
      'TOTAL REVENUE', 
      `R${safeStatistics.totalRevenue.toFixed(2)}`, 
      'Gross revenue generated', 
      20 + (cardWidth + cardSpacing) * 2, yPosition, cardWidth, cardHeight, [139, 92, 246]
    );
    
    yPosition += cardHeight + 20;
    
    // Row 2: Secondary KPIs with executive spacing
    addDashboardCard(
      'PENDING ORDERS', 
      safeStatistics.pendingOrders, 
      'Awaiting processing', 
      20, yPosition, cardWidth, cardHeight, [245, 158, 11]
    );
    
    addDashboardCard(
      'PRODUCTS ON SALE', 
      safeStatistics.productsOnSale, 
      'Currently discounted', 
      20 + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, [236, 72, 153]
    );
    
    addDashboardCard(
      'LOW STOCK ALERTS', 
      safeStatistics.lowStockItems, 
      'Require restocking', 
      20 + (cardWidth + cardSpacing) * 2, yPosition, cardWidth, cardHeight, [239, 68, 68]
    );
    
    yPosition += cardHeight + 25;

    // Stock Analytics Dashboard with executive styling
    checkNewPage(90);
    addText('STOCK ANALYTICS DASHBOARD', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    addText('Inventory Management & Stock Distribution Analysis', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    if (safeStatistics.stockStatus) {
      // Create pie chart for stock distribution
      const stockData = [
        { label: 'High Stock', value: safeStatistics.stockStatus.high, color: [16, 185, 129] },
        { label: 'Medium Stock', value: safeStatistics.stockStatus.medium, color: [245, 158, 11] },
        { label: 'Low Stock', value: safeStatistics.stockStatus.low, color: [239, 68, 68] },
        { label: 'Out of Stock', value: safeStatistics.stockStatus.out, color: [107, 114, 128] }
      ];

      // Left side: Pie chart visualization (without labels to avoid duplication)
      const addPieChartOnly = (data, x, y, radius) => {
        data.forEach((item, index) => {
          // Draw pie slice with subtle border
          pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
          pdf.circle(x, y, radius, 'F');
          pdf.setDrawColor(255, 255, 255);
          pdf.setLineWidth(1);
          pdf.circle(x, y, radius);
        });
      };
      
      addPieChartOnly(stockData, 40, yPosition + 40, 25);
      addText('Stock Distribution', 40, yPosition + 15, 100, 12, 'bold', [15, 23, 42]);
      
      // Right side: Detailed breakdown
      const breakdownX = 120;
      addText('STOCK BREAKDOWN', breakdownX, yPosition, 100, 16, 'bold', [15, 23, 42]);
      yPosition += 25;
      
      stockData.forEach((item, index) => {
        const itemY = yPosition + (index * 18);
        
        // Color indicator circle
        addCircle(breakdownX + 5, itemY - 2, 4, item.color);
        
        // Label and value
        addText(item.label, breakdownX + 15, itemY, 60, 12, 'normal', [0, 0, 0]);
        addText(item.value.toString(), breakdownX + 80, itemY, 20, 12, 'bold', [0, 0, 0]);
        
        // Percentage calculation
        const total = stockData.reduce((sum, item) => sum + item.value, 0);
        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
        addText(`${percentage}%`, breakdownX + 100, itemY, 20, 11, 'normal', [100, 100, 100]);
      });
      
      yPosition += (stockData.length * 18) + 35;
    }

    // Sales Performance Dashboard with executive styling
    checkNewPage(110);
    addText('SALES PERFORMANCE DASHBOARD', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    addText('Revenue Analysis & Top Performing Products', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    if (safeStatistics.topSellingProducts && safeStatistics.topSellingProducts.length > 0) {
      // Create bar chart for top products
      const topProducts = safeStatistics.topSellingProducts.slice(0, 5);
      const chartData = topProducts.map((product, index) => ({
        label: product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name,
        value: product.totalSold || 0,
        color: [16 + (index * 20), 185 - (index * 10), 129 + (index * 15)]
      }));

      // Left side: Bar chart
      addBarChart(chartData, 20, yPosition, 80, 60, 'Top 5 Products by Sales');
      
      // Right side: Detailed table
      const tableX = 110;
      addText('TOP SELLING PRODUCTS', tableX, yPosition, 100, 14, 'bold', [15, 23, 42]);
      yPosition += 20;
      
      // Table header
      addRect(tableX, yPosition, 80, 8, [240, 240, 240]);
      addText('Product', tableX + 2, yPosition + 5, 30, 9, 'bold', [0, 0, 0]);
      addText('Sales', tableX + 35, yPosition + 5, 15, 9, 'bold', [0, 0, 0]);
      addText('Revenue', tableX + 55, yPosition + 5, 20, 9, 'bold', [0, 0, 0]);
      yPosition += 12;
      
      // Table data
      safeStatistics.topSellingProducts.slice(0, 8).forEach((product, index) => {
        const productName = product.name && product.name.length > 15 ? product.name.substring(0, 15) + '...' : (product.name || 'Unknown Product');
        const productPrice = product.salePrice || product.price || 0;
        const productSold = product.totalSold || 0;
        const revenue = (productSold * productPrice).toFixed(0);
        
        // Alternating row colors
        if (index % 2 === 0) {
          addRect(tableX, yPosition - 2, 80, 8, [250, 250, 250]);
        }
        
        addText(productName, tableX + 2, yPosition + 5, 30, 8, 'normal', [0, 0, 0]);
        addText(productSold.toString(), tableX + 35, yPosition + 5, 15, 8, 'normal', [0, 0, 0]);
        addText(`R${revenue}`, tableX + 55, yPosition + 5, 20, 8, 'normal', [0, 0, 0]);
        
        yPosition += 8;
      });
      
      yPosition += 20;
    } else {
      addText('No sales data available', 20, yPosition, pageWidth - 40, 12, 'normal', [100, 100, 100]);
      yPosition += 20;
    }

    // Inventory Management Dashboard with executive styling
    checkNewPage(90);
    addText('INVENTORY MANAGEMENT DASHBOARD', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    addText('Stock Alerts & Inventory Optimization Insights', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    if (safeStatistics.lowStockProducts && safeStatistics.lowStockProducts.length > 0) {
      // Alert summary card
      addDashboardCard(
        'STOCK ALERTS', 
        safeStatistics.lowStockProducts.length, 
        'Products requiring attention', 
        20, yPosition, cardWidth, cardHeight, [239, 68, 68]
      );
      
      // Critical stock count
      const criticalStock = safeStatistics.lowStockProducts.filter(p => p.stockQuantity === 0).length;
      addDashboardCard(
        'OUT OF STOCK', 
        criticalStock, 
        'Zero inventory items', 
        20 + cardWidth + 10, yPosition, cardWidth, cardHeight, [220, 38, 127]
      );
      
      // Low stock count
      const lowStock = safeStatistics.lowStockProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
      addDashboardCard(
        'LOW STOCK', 
        lowStock, 
        'Below minimum threshold', 
        20 + (cardWidth + 10) * 2, yPosition, cardWidth, cardHeight, [245, 158, 11]
      );
      
      yPosition += cardHeight + 20;
      
      // Detailed alert table
      addText('STOCK ALERT DETAILS', 20, yPosition, pageWidth - 40, 14, 'bold', [15, 23, 42]);
      yPosition += 20;
      
      // Table header
      addRect(20, yPosition, pageWidth - 40, 8, [240, 240, 240]);
      addText('Product', 22, yPosition + 5, 60, 9, 'bold', [0, 0, 0]);
      addText('Stock', 85, yPosition + 5, 20, 9, 'bold', [0, 0, 0]);
      addText('Status', 110, yPosition + 5, 30, 9, 'bold', [0, 0, 0]);
      addText('Price', 145, yPosition + 5, 25, 9, 'bold', [0, 0, 0]);
      yPosition += 12;
      
      // Table data
      safeStatistics.lowStockProducts.slice(0, 10).forEach((product, index) => {
        const productName = product.name && product.name.length > 20 ? product.name.substring(0, 20) + '...' : (product.name || 'Unknown Product');
        const status = product.stockQuantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK';
        const productPrice = product.salePrice || product.price || 0;
        const price = productPrice.toFixed(0);
        const statusColor = product.stockQuantity === 0 ? [239, 68, 68] : [245, 158, 11];
        
        // Alternating row colors
        if (index % 2 === 0) {
          addRect(20, yPosition - 2, pageWidth - 40, 8, [250, 250, 250]);
        }
        
        addText(productName, 22, yPosition + 5, 60, 8, 'normal', [0, 0, 0]);
        addText(product.stockQuantity.toString(), 85, yPosition + 5, 20, 8, 'normal', [0, 0, 0]);
        addText(status, 110, yPosition + 5, 30, 8, 'bold', statusColor);
        addText(`R${price}`, 145, yPosition + 5, 25, 8, 'normal', [0, 0, 0]);
        
        yPosition += 8;
      });
      
      yPosition += 20;
    } else {
      // Success message with professional styling
      addRect(20, yPosition, pageWidth - 40, 30, [240, 248, 255]);
      addRect(20, yPosition, pageWidth - 40, 30, null, [16, 185, 129]);
      addText('✅ INVENTORY STATUS: OPTIMAL', 30, yPosition + 10, pageWidth - 60, 14, 'bold', [16, 185, 129]);
      addText('All products have adequate stock levels', 30, yPosition + 20, pageWidth - 60, 10, 'normal', [100, 100, 100]);
      yPosition += 40;
    }

    // Order Analytics Dashboard with executive styling
    checkNewPage(90);
    addText('ORDER ANALYTICS DASHBOARD', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    addText('Order Processing & Customer Fulfillment Metrics', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    if (safeStatistics.orderStatusDistribution) {
      // Order status pie chart
      const orderData = [
        { label: 'Completed', value: safeStatistics.orderStatusDistribution.completed, color: [16, 185, 129] },
        { label: 'Pending', value: safeStatistics.orderStatusDistribution.pending, color: [245, 158, 11] },
        { label: 'Processing', value: safeStatistics.orderStatusDistribution.processing, color: [59, 130, 246] },
        { label: 'Ready', value: safeStatistics.orderStatusDistribution.ready, color: [139, 92, 246] },
        { label: 'Cancelled', value: safeStatistics.orderStatusDistribution.cancelled, color: [239, 68, 68] }
      ];

      // Left side: Order status pie chart (without labels to avoid duplication)
      const addOrderPieChartOnly = (data, x, y, radius) => {
        data.forEach((item, index) => {
          // Draw pie slice with subtle border
          pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
          pdf.circle(x, y, radius, 'F');
          pdf.setDrawColor(255, 255, 255);
          pdf.setLineWidth(1);
          pdf.circle(x, y, radius);
        });
      };
      
      addOrderPieChartOnly(orderData, 40, yPosition + 40, 25);
      addText('Order Status Distribution', 40, yPosition + 15, 100, 12, 'bold', [15, 23, 42]);
      
      // Right side: Order metrics
      const metricsX = 120;
      addText('ORDER METRICS', metricsX, yPosition, 100, 16, 'bold', [15, 23, 42]);
      yPosition += 25;
      
      // Key order metrics
      const totalOrders = Object.values(safeStatistics.orderStatusDistribution).reduce((sum, val) => sum + val, 0);
      const completionRate = totalOrders > 0 ? ((safeStatistics.orderStatusDistribution.completed / totalOrders) * 100).toFixed(1) : '0.0';
      
      addText(`Total Orders: ${totalOrders}`, metricsX, yPosition, 80, 12, 'normal', [0, 0, 0]);
      yPosition += 18;
      addText(`Completion Rate: ${completionRate}%`, metricsX, yPosition, 80, 12, 'normal', [0, 0, 0]);
      yPosition += 18;
      addText(`Avg Order Value: R${safeStatistics.averageOrderValue.toFixed(2)}`, metricsX, yPosition, 80, 12, 'normal', [0, 0, 0]);
      yPosition += 18;
      addText(`Pending Orders: ${safeStatistics.orderStatusDistribution.pending}`, metricsX, yPosition, 80, 12, 'normal', [0, 0, 0]);
      
      yPosition += 35;
    }

    // Sales & Promotions Dashboard with executive styling
    checkNewPage(90);
    addText('SALES & PROMOTIONS DASHBOARD', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    addText('Promotional Campaigns & Discount Strategy Analysis', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    if (safeStatistics.saleProducts && safeStatistics.saleProducts.length > 0) {
      // Sales summary cards
      const totalDiscountValue = safeStatistics.saleProducts.reduce((sum, product) => {
        return sum + ((product.price - product.salePrice) * product.stockQuantity);
      }, 0);
      
      addDashboardCard(
        'ACTIVE SALES', 
        safeStatistics.saleProducts.length, 
        'Products on discount', 
        20, yPosition, cardWidth, cardHeight, [139, 92, 246]
      );
      
      addDashboardCard(
        'DISCOUNT VALUE', 
        `R${totalDiscountValue.toFixed(0)}`, 
        'Total discount amount', 
        20 + cardWidth + 10, yPosition, cardWidth, cardHeight, [236, 72, 153]
      );
      
      addDashboardCard(
        'SALE PERCENTAGE', 
        `${safeStatistics.salePercentage.toFixed(1)}%`, 
        'Of total products', 
        20 + (cardWidth + 10) * 2, yPosition, cardWidth, cardHeight, [168, 85, 247]
      );
      
      yPosition += cardHeight + 20;
      
      // Sales table
      addText('CURRENT SALES', 20, yPosition, pageWidth - 40, 14, 'bold', [15, 23, 42]);
      yPosition += 20;
      
      // Table header
      addRect(20, yPosition, pageWidth - 40, 8, [240, 240, 240]);
      addText('Product', 22, yPosition + 5, 50, 9, 'bold', [0, 0, 0]);
      addText('Original', 75, yPosition + 5, 25, 9, 'bold', [0, 0, 0]);
      addText('Sale Price', 105, yPosition + 5, 25, 9, 'bold', [0, 0, 0]);
      addText('Discount', 135, yPosition + 5, 25, 9, 'bold', [0, 0, 0]);
      addText('Stock', 165, yPosition + 5, 20, 9, 'bold', [0, 0, 0]);
      yPosition += 12;
      
      // Table data
      safeStatistics.saleProducts.slice(0, 8).forEach((product, index) => {
        const productName = product.name && product.name.length > 15 ? product.name.substring(0, 15) + '...' : (product.name || 'Unknown Product');
        const originalPrice = product.price || 0;
        const salePrice = product.salePrice || 0;
        const discount = originalPrice > 0 ? ((originalPrice - salePrice) / originalPrice * 100).toFixed(0) : '0';
        
        // Alternating row colors
        if (index % 2 === 0) {
          addRect(20, yPosition - 2, pageWidth - 40, 8, [250, 250, 250]);
        }
        
        addText(productName, 22, yPosition + 5, 50, 8, 'normal', [0, 0, 0]);
        addText(`R${originalPrice.toFixed(0)}`, 75, yPosition + 5, 25, 8, 'normal', [0, 0, 0]);
        addText(`R${salePrice.toFixed(0)}`, 105, yPosition + 5, 25, 8, 'normal', [0, 0, 0]);
        addText(`${discount}%`, 135, yPosition + 5, 25, 8, 'bold', [139, 92, 246]);
        addText((product.stockQuantity || 0).toString(), 165, yPosition + 5, 20, 8, 'normal', [0, 0, 0]);
        
        yPosition += 8;
      });
      
      yPosition += 20;
    } else {
      addRect(20, yPosition, pageWidth - 40, 30, [248, 250, 252]);
      addRect(20, yPosition, pageWidth - 40, 30, null, [139, 92, 246]);
      addText('📊 NO ACTIVE SALES', 30, yPosition + 10, pageWidth - 60, 14, 'bold', [139, 92, 246]);
      addText('No products are currently on sale', 30, yPosition + 20, pageWidth - 60, 10, 'normal', [100, 100, 100]);
      yPosition += 40;
    }

    // Business Intelligence Summary with executive styling
    checkNewPage(80);
    addText('BUSINESS INTELLIGENCE SUMMARY', 20, yPosition, pageWidth - 40, 20, 'bold', [15, 23, 42]);
    addText('Strategic Insights & Key Business Metrics', 20, yPosition + 12, pageWidth - 40, 14, 'normal', [75, 85, 99]);
    yPosition += 35;

    // Key insights cards
    const insights = [
      { title: 'AVERAGE ORDER VALUE', value: `R${safeStatistics.averageOrderValue.toFixed(2)}`, color: [16, 185, 129] },
      { title: 'STOCK TURNOVER RATE', value: `${safeStatistics.stockTurnoverRate.toFixed(1)}%`, color: [59, 130, 246] },
      { title: 'SALE PERCENTAGE', value: `${safeStatistics.salePercentage.toFixed(1)}%`, color: [139, 92, 246] },
      { title: 'TOTAL CATEGORIES', value: `${safeStatistics.categoryStats.length}`, color: [245, 158, 11] }
    ];

    insights.forEach((insight, index) => {
      const x = 20 + (index % 2) * (cardWidth + cardSpacing);
      const y = yPosition + Math.floor(index / 2) * (cardHeight + cardSpacing);
      
      addDashboardCard(
        insight.title,
        insight.value,
        'Strategic business metric',
        x, y, cardWidth, cardHeight, insight.color
      );
    });
    
    yPosition += (Math.ceil(insights.length / 2) * (cardHeight + cardSpacing)) + 25;

    // Executive-Level Footer with premium styling
    yPosition = pageHeight - 35;
    pdf.setFillColor(8, 12, 20); // Deep navy background
    pdf.rect(0, yPosition, pageWidth, 35, 'F');
    
    // Add premium gradient effect
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, yPosition, pageWidth, 35, 'F');
    
    // Add subtle accent line
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, yPosition, pageWidth, 3, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🌿 CANNA BOMB EXECUTIVE ANALYTICS REPORT', 25, yPosition + 12);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Generated by Canna Bomb Strategic Business Intelligence System', 25, yPosition + 20);
    pdf.text(`Report Date: ${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 25, yPosition + 27);
    
    pdf.setFontSize(11);
    pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - 35, yPosition + 20);
    pdf.text('CONFIDENTIAL - EXECUTIVE USE ONLY', pageWidth - 60, yPosition + 27);
    
    // Add executive-level document classification
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(16, 185, 129);
    pdf.text('© 2024 Canna Bomb. All Rights Reserved.', pageWidth - 60, yPosition + 32);

    // Save the PDF with executive-level naming
    const fileName = `CannaBomb_Executive_Business_Intelligence_Report_${now.toISOString().split('T')[0]}.pdf`;
    // Also produce a base64 data URL for emailing
    const base64 = pdf.output('datauristring');
    pdf.save(fileName);

    return { success: true, fileName, base64 };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

// Generate a simple chart data for PDF
export const generateChartData = (statistics) => {
  if (!statistics.stockStatus) return null;
  
  return {
    labels: ['High Stock', 'Medium Stock', 'Low Stock', 'Out of Stock'],
    data: [
      statistics.stockStatus.high,
      statistics.stockStatus.medium,
      statistics.stockStatus.low,
      statistics.stockStatus.out
    ],
    colors: [
      [16, 185, 129],   // Green
      [245, 158, 11],   // Yellow
      [239, 68, 68],    // Red
      [107, 114, 128]   // Gray
    ]
  };
};
