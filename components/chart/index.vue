<template>
  <view class="chart-container">
    <view v-if="!chartData || chartData.length === 0" class="chart-empty">
      <text class="empty-icon">📊</text>
      <text class="empty-text">暂无图表数据</text>
    </view>
    <view v-else class="chart-wrapper">
      <canvas 
        :id="canvasId" 
        :canvas-id="canvasId"
        class="chart-canvas"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      ></canvas>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 图表类型
    type: {
      type: String,
      default: 'line' // line | pie | bar
    },
    // 图表数据
    chartData: {
      type: Object,
      default: () => null
    },
    // 图表配置
    options: {
      type: Object,
      default: () => ({})
    },
    // Canvas ID（多个图表时需要不同ID）
    canvasId: {
      type: String,
      default: 'chart-canvas'
    },
    // 图表高度
    height: {
      type: String,
      default: '500rpx'
    }
  },

  data() {
    return {
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
      pixelRatio: 1
    };
  },

  watch: {
    chartData: {
      handler() {
        this.drawChart();
      },
      deep: true
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initCanvas();
    });
  },

  methods: {
    initCanvas() {
      const query = uni.createSelectorQuery().in(this);
      query.select('.chart-canvas').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          this.canvasWidth = res[0].width;
          this.canvasHeight = res[0].height;
          // 使用新API获取像素比
          try {
            const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : (uni.getSystemInfoSync ? uni.getSystemInfoSync() : {})
            this.pixelRatio = windowInfo.pixelRatio || 1
          } catch (e) {
            this.pixelRatio = 1
          }
          
          this.ctx = uni.createCanvasContext(this.canvasId, this);
          this.drawChart();
        }
      });
    },

    drawChart() {
      if (!this.ctx || !this.chartData) return;

      // 清空画布
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 根据类型绘制图表
      switch (this.type) {
        case 'line':
          this.drawLineChart();
          break;
        case 'pie':
          this.drawPieChart();
          break;
        case 'bar':
          this.drawBarChart();
          break;
      }

      this.ctx.draw();
    },

    // 绘制折线图
    drawLineChart() {
      const { dates = [], series = {} } = this.chartData;
      
      if (dates.length === 0) return;

      const padding = { top: 60, right: 40, bottom: 60, left: 60 };
      const chartWidth = this.canvasWidth - padding.left - padding.right;
      const chartHeight = this.canvasHeight - padding.top - padding.bottom;

      // 计算最大值
      let maxValue = 0;
      Object.values(series).forEach(data => {
        const max = Math.max(...data.map(d => d.value || 0));
        if (max > maxValue) maxValue = max;
      });
      maxValue = Math.ceil(maxValue * 1.2); // 留出20%空间

      // 绘制标题
      this.ctx.setFontSize(14);
      this.ctx.setFillStyle('#333333');
      this.ctx.setTextAlign('center');
      this.ctx.fillText('门诊用药趋势', this.canvasWidth / 2, 30);

      // 绘制坐标轴
      this.ctx.setStrokeStyle('#e0e0e0');
      this.ctx.setLineWidth(1);
      
      // Y轴
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left, padding.top);
      this.ctx.lineTo(padding.left, this.canvasHeight - padding.bottom);
      this.ctx.stroke();

      // X轴
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left, this.canvasHeight - padding.bottom);
      this.ctx.lineTo(this.canvasWidth - padding.right, this.canvasHeight - padding.bottom);
      this.ctx.stroke();

      // 绘制Y轴刻度
      const ySteps = 5;
      this.ctx.setFontSize(10);
      this.ctx.setTextAlign('right');
      for (let i = 0; i <= ySteps; i++) {
        const value = (maxValue / ySteps) * i;
        const y = this.canvasHeight - padding.bottom - (chartHeight / ySteps) * i;
        
        this.ctx.setFillStyle('#999999');
        this.ctx.fillText(Math.round(value), padding.left - 10, y + 4);
        
        // 绘制网格线
        this.ctx.setStrokeStyle('#f0f0f0');
        this.ctx.beginPath();
        this.ctx.moveTo(padding.left, y);
        this.ctx.lineTo(this.canvasWidth - padding.right, y);
        this.ctx.stroke();
      }

      // 绘制X轴标签
      this.ctx.setTextAlign('center');
      const xStep = chartWidth / (dates.length - 1);
      dates.forEach((date, i) => {
        const x = padding.left + xStep * i;
        this.ctx.setFillStyle('#999999');
        this.ctx.fillText(date.slice(-5), x, this.canvasHeight - padding.bottom + 20);
      });

      // 绘制折线
      const colors = {
        land_park: '#1890ff',
        water_park: '#52c41a',
        clinic_storage: '#faad14'
      };
      const labels = {
        land_park: '陆园',
        water_park: '水园',
        clinic_storage: '医务室'
      };

      let legendY = 50;
      Object.entries(series).forEach(([key, data]) => {
        const color = colors[key] || '#666666';
        
        // 绘制线条
        this.ctx.setStrokeStyle(color);
        this.ctx.setLineWidth(2);
        this.ctx.beginPath();
        
        data.forEach((point, i) => {
          const x = padding.left + xStep * i;
          const y = this.canvasHeight - padding.bottom - (point.value / maxValue) * chartHeight;
          
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        });
        this.ctx.stroke();

        // 绘制数据点
        this.ctx.setFillStyle(color);
        data.forEach((point, i) => {
          const x = padding.left + xStep * i;
          const y = this.canvasHeight - padding.bottom - (point.value / maxValue) * chartHeight;
          
          this.ctx.beginPath();
          this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
          this.ctx.fill();
        });

        // 绘制图例
        this.ctx.setFillStyle(color);
        this.ctx.fillRect(this.canvasWidth - 120, legendY, 20, 10);
        this.ctx.setFillStyle('#333333');
        this.ctx.setTextAlign('left');
        this.ctx.setFontSize(12);
        this.ctx.fillText(labels[key] || key, this.canvasWidth - 95, legendY + 9);
        legendY += 20;
      });
    },

    // 绘制饼图
    drawPieChart() {
      const { pieData = [] } = this.chartData;
      
      if (pieData.length === 0) return;

      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      const radius = Math.min(this.canvasWidth, this.canvasHeight) / 3;

      // 绘制标题
      this.ctx.setFontSize(14);
      this.ctx.setFillStyle('#333333');
      this.ctx.setTextAlign('center');
      this.ctx.fillText('园区出库分布', this.canvasWidth / 2, 30);

      // 计算总值
      const total = pieData.reduce((sum, item) => sum + item.value, 0);

      // 颜色数组
      const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

      // 绘制饼图
      let startAngle = -Math.PI / 2;
      pieData.forEach((item, index) => {
        const angle = (item.value / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;
        const color = colors[index % colors.length];

        // 绘制扇形
        this.ctx.setFillStyle(color);
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();

        // 绘制标签
        const midAngle = startAngle + angle / 2;
        const labelX = centerX + Math.cos(midAngle) * (radius + 30);
        const labelY = centerY + Math.sin(midAngle) * (radius + 30);
        
        const percentage = ((item.value / total) * 100).toFixed(1);
        this.ctx.setFontSize(11);
        this.ctx.setFillStyle('#333333');
        this.ctx.setTextAlign(labelX > centerX ? 'left' : 'right');
        this.ctx.fillText(`${item.name}`, labelX, labelY - 8);
        this.ctx.fillText(`${percentage}%`, labelX, labelY + 8);

        startAngle = endAngle;
      });

      // 绘制中心白圈（环形图效果）
      this.ctx.setFillStyle('#ffffff');
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      this.ctx.fill();

      // 绘制总数
      this.ctx.setFontSize(16);
      this.ctx.setFillStyle('#333333');
      this.ctx.setTextAlign('center');
      this.ctx.fillText('总计', centerX, centerY - 8);
      this.ctx.setFontSize(20);
      this.ctx.setFillStyle('#1890ff');
      this.ctx.fillText(total, centerX, centerY + 12);
    },

    // 绘制柱状图
    drawBarChart() {
      const { drugNames = [], theoretical = [], actual = [] } = this.chartData;
      
      if (drugNames.length === 0) return;

      const padding = { top: 60, right: 40, bottom: 80, left: 60 };
      const chartWidth = this.canvasWidth - padding.left - padding.right;
      const chartHeight = this.canvasHeight - padding.top - padding.bottom;

      // 计算最大值
      const maxValue = Math.max(
        ...theoretical,
        ...actual
      ) * 1.2;

      // 绘制标题
      this.ctx.setFontSize(14);
      this.ctx.setFillStyle('#333333');
      this.ctx.setTextAlign('center');
      this.ctx.fillText('盘点差异对比', this.canvasWidth / 2, 30);

      // 绘制坐标轴
      this.ctx.setStrokeStyle('#e0e0e0');
      this.ctx.setLineWidth(1);
      
      // Y轴
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left, padding.top);
      this.ctx.lineTo(padding.left, this.canvasHeight - padding.bottom);
      this.ctx.stroke();

      // X轴
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left, this.canvasHeight - padding.bottom);
      this.ctx.lineTo(this.canvasWidth - padding.right, this.canvasHeight - padding.bottom);
      this.ctx.stroke();

      // 绘制Y轴刻度
      const ySteps = 5;
      this.ctx.setFontSize(10);
      this.ctx.setTextAlign('right');
      for (let i = 0; i <= ySteps; i++) {
        const value = (maxValue / ySteps) * i;
        const y = this.canvasHeight - padding.bottom - (chartHeight / ySteps) * i;
        
        this.ctx.setFillStyle('#999999');
        this.ctx.fillText(Math.round(value), padding.left - 10, y + 4);
        
        // 网格线
        this.ctx.setStrokeStyle('#f0f0f0');
        this.ctx.beginPath();
        this.ctx.moveTo(padding.left, y);
        this.ctx.lineTo(this.canvasWidth - padding.right, y);
        this.ctx.stroke();
      }

      // 绘制柱状图
      const barGroupWidth = chartWidth / drugNames.length;
      const barWidth = barGroupWidth / 3;
      const barGap = barWidth / 4;

      drugNames.forEach((name, i) => {
        const x = padding.left + barGroupWidth * i + barGroupWidth / 2;

        // 理论库存（蓝色）
        const theoreticalHeight = (theoretical[i] / maxValue) * chartHeight;
        this.ctx.setFillStyle('#1890ff');
        this.ctx.fillRect(
          x - barWidth - barGap / 2,
          this.canvasHeight - padding.bottom - theoreticalHeight,
          barWidth,
          theoreticalHeight
        );

        // 实际库存（绿色）
        const actualHeight = (actual[i] / maxValue) * chartHeight;
        this.ctx.setFillStyle('#52c41a');
        this.ctx.fillRect(
          x + barGap / 2,
          this.canvasHeight - padding.bottom - actualHeight,
          barWidth,
          actualHeight
        );

        // X轴标签
        this.ctx.save();
        this.ctx.translate(x, this.canvasHeight - padding.bottom + 15);
        this.ctx.rotate(-45 * Math.PI / 180);
        this.ctx.setFontSize(10);
        this.ctx.setFillStyle('#666666');
        this.ctx.setTextAlign('right');
        this.ctx.fillText(name.length > 6 ? name.slice(0, 6) + '...' : name, 0, 0);
        this.ctx.restore();
      });

      // 绘制图例
      const legendY = 50;
      
      this.ctx.setFillStyle('#1890ff');
      this.ctx.fillRect(this.canvasWidth - 140, legendY, 20, 10);
      this.ctx.setFillStyle('#333333');
      this.ctx.setTextAlign('left');
      this.ctx.setFontSize(12);
      this.ctx.fillText('理论库存', this.canvasWidth - 115, legendY + 9);

      this.ctx.setFillStyle('#52c41a');
      this.ctx.fillRect(this.canvasWidth - 140, legendY + 20, 20, 10);
      this.ctx.setFillStyle('#333333');
      this.ctx.fillText('实际库存', this.canvasWidth - 115, legendY + 29);
    },

    touchStart(e) {
      // 触摸事件处理（可扩展）
    },

    touchMove(e) {
      // 触摸移动处理（可扩展）
    },

    touchEnd(e) {
      // 触摸结束处理（可扩展）
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  position: relative;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 80rpx;
    opacity: 0.3;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 26rpx;
    color: #999;
  }
}

.chart-wrapper {
  width: 100%;
}

.chart-canvas {
  width: 100%;
  height: 500rpx;
}
</style>


