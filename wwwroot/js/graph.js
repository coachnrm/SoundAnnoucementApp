// // wwwroot/chartInterop.js
// // Robust handling: 1 canvas -> 1 chart; auto-destroy if reusing the canvas.
// window.vitalsChart = (function () {
//   // Track charts per canvas element
//   const charts = new WeakMap();

//   function ensureDestroyed(canvas) {
//     // If Chart.js already attached one, nuke it first
//     const existing = (typeof Chart !== "undefined" && Chart.getChart)
//       ? Chart.getChart(canvas)
//       : null;

//     if (existing) {
//       existing.destroy();
//     }
//     const mapped = charts.get(canvas);
//     if (mapped && mapped !== existing) {
//       try { mapped.destroy(); } catch { /* ignore */ }
//       charts.delete(canvas);
//     }
//   }

//   function initOrUpdate(canvas, points) {
//     const ctx = canvas.getContext('2d');

//     // Updated data mapping to use vsDatetime for x and bt/pr for y
//     // const dataBt = points.map(p => ({ 
//     //   x: new Date(p.vsDatetime), 
//     //   y: p.bt ?? null 
//     // }));
//     const dataBt = points.map(p => ({
//        x: new Date(p.x),
//        y: p.bt ?? null
// }));
    
//     // const dataPr = points.map(p => ({ 
//     //   x: new Date(p.vsDatetime), 
//     //   y: p.pr ?? null 
//     // }));

//     const dataPr = points.map(p => ({
//       x: new Date(p.x),
//       y: p.pr ?? null
// }));

//     // If we already have a chart for this canvas, just update it.
//     let chart = charts.get(canvas) || (Chart.getChart ? Chart.getChart(canvas) : null);

//     if (!chart) {
//       // Make sure no leftover instance hangs on the canvas
//       ensureDestroyed(canvas);

//       const config = {
//         type: 'line',
//         data: {
//           datasets: [
//             {
//               label: 'BT',
//               data: dataBt,
//               borderColor: 'blue',
//               backgroundColor: 'blue',
//               pointRadius: 2,
//               borderWidth: 2,
//               tension: 0.25,
//               spanGaps: false
//             },
//             {
//               label: 'PR',
//               data: dataPr,
//               borderColor: 'red',
//               backgroundColor: 'red',
//               pointRadius: 2,
//               borderWidth: 2,
//               tension: 0.25,
//               spanGaps: false
//             }
//           ]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           parsing: false,
//           scales: {
//             x: {
//               type: 'time',
//               time: {
//                 tooltipFormat: 'yyyy-MM-dd HH:mm',
//                 displayFormats: { 
//                   minute: 'MM-dd HH:mm', 
//                   hour: 'MM-dd HH:mm', 
//                   day: 'yyyy-MM-dd',
//                   month: 'yyyy-MM',
//                   year: 'yyyy'
//                 }
//               },
//               ticks: { 
//                 maxRotation: 45,
//                 autoSkip: true,
//                 callback: function(value, index, values) {
//                     const date = new Date(value);
//                     const year = date.getFullYear();
//                     const month = String(date.getMonth() + 1).padStart(2, '0');
//                     const day = String(date.getDate()).padStart(2, '0');
//                     const hours = String(date.getHours()).padStart(2, '0');
//                     const minutes = String(date.getMinutes()).padStart(2, '0');
//                     // ✅ Same format as .NET "yyyy-MM-dd HH:mm"
//                     return `${year}-${month}-${day} ${hours}:${minutes}`;
//                 }
//                 },
//               title: {
//                 display: true,
//                 text: 'Date & Time'
//               }
//             },
//             y: { 
//               beginAtZero: false, 
//               title: { 
//                 display: true, 
//                 text: 'Value' 
//               } 
//             }
//           },
//           plugins: {
//             legend: { position: 'top' },
//             tooltip: { 
//                 mode: 'index', 
//                 intersect: false,
//                 callbacks: {
//                     title: function(tooltipItems) {
//                     const date = new Date(tooltipItems[0].parsed.x);
//                     const year = date.getFullYear();
//                     const month = String(date.getMonth() + 1).padStart(2, '0');
//                     const day = String(date.getDate()).padStart(2, '0');
//                     const hours = String(date.getHours()).padStart(2, '0');
//                     const minutes = String(date.getMinutes()).padStart(2, '0');
//                     return `${year}-${month}-${day} ${hours}:${minutes}`;
//                     }
//                 }
//             }
//           },
//           interaction: { mode: 'nearest', intersect: false }
//         }
//       };

//       chart = new Chart(ctx, config);
//       charts.set(canvas, chart);
//     }

//     // Update data & refresh
//     chart.data.datasets[0].data = dataBt;
//     chart.data.datasets[1].data = dataPr;
//     chart.update();
//   }

//   function destroy(canvas) {
//     // Destroy only this canvas' chart (useful on component dispose)
//     const chart = charts.get(canvas) || (Chart.getChart ? Chart.getChart(canvas) : null);
//     if (chart) {
//       try { chart.destroy(); } catch { /* ignore */ }
//       charts.delete(canvas);
//     }
//   }

//   return { initOrUpdate, destroy };
// })();

// Robust handling: 1 canvas -> 1 chart; auto-destroy if reusing the canvas.
window.vitalsChart = (function () {
  // Track charts per canvas element
  const charts = new WeakMap();

  function ensureDestroyed(canvas) {
    const existing = (typeof Chart !== "undefined" && Chart.getChart)
      ? Chart.getChart(canvas)
      : null;

    if (existing) {
      existing.destroy();
    }
    const mapped = charts.get(canvas);
    if (mapped && mapped !== existing) {
      try { mapped.destroy(); } catch { /* ignore */ }
      charts.delete(canvas);
    }
  }

  function initOrUpdate(canvas, points) {
    const ctx = canvas.getContext('2d');

    // Map incoming data:
    // We expect each point like: { x: <date string or ISO>, bt: number|null, pr: number|null }
    const toPoint = (p, key) => {
      const d = new Date(p.x);
      return isNaN(d) ? null : { x: d, y: p[key] ?? null };
    };

    const dataBt = points.map(p => toPoint(p, 'bt')).filter(Boolean);
    const dataPr = points.map(p => toPoint(p, 'pr')).filter(Boolean);

    // If we already have a chart for this canvas, just update it.
    let chart = charts.get(canvas) || (Chart.getChart ? Chart.getChart(canvas) : null);

    if (!chart) {
      ensureDestroyed(canvas);

      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'BT',
              data: dataBt,
              borderColor: 'blue',
              backgroundColor: 'blue',
              pointRadius: 2,
              borderWidth: 2,
              tension: 0.25,
              spanGaps: false,
              yAxisID: 'y1'   
            },
            {
              label: 'PR',
              data: dataPr,
              borderColor: 'red',
              backgroundColor: 'red',
              pointRadius: 2,
              borderWidth: 2,
              tension: 0.25,
              spanGaps: false,
              yAxisID: 'y2'   
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          parsing: false, // we supply {x,y} already
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'yyyy-MM-dd HH:mm',
                displayFormats: { 
                  minute: 'MM-dd HH:mm', 
                  hour: 'MM-dd HH:mm', 
                  day: 'yyyy-MM-dd',
                  month: 'yyyy-MM',
                  year: 'yyyy'
                }
              },
              ticks: { 
                maxRotation: 45,
                autoSkip: true,
                callback: function(value) {
                  // value is the tick value; Chart.js passes ms since epoch here
                  const date = new Date(value);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  // "yyyy-MM-dd HH:mm"
                  return `${year}-${month}-${day} ${hours}:${minutes}`;
                }
              },
              title: {
                display: true,
                text: 'Date & Time'
              },
              // ✅ Add this:
              min: points.length > 0 ? new Date(points[0].x) : undefined,
              max: new Date()
            },
            // y: { 
            //   beginAtZero: false, 
            //   title: { 
            //     display: true, 
            //     text: 'Value' 
            //   } 
            // },
            // ✅ Left Y-axis for BT
            y1: { 
              beginAtZero: false, 
              min: 35,
              max: 41,
              title: { 
                display: true, 
                text: 'Body Temp (°C)',
                color: 'blue' 
              },
              ticks: {
                color: 'blue'
              },
              grid: {
                color: 'rgba(0,0,255,0.1)' // light blue grid lines
              },
              position: 'left'
            },
            // ✅ Right Y-axis for PR
            y2: { 
              beginAtZero: false, 
              min: 40,
              max: 160,
              title: { 
                display: true, 
                text: 'Pulse Rate (/min)',
                color: 'red' 
              },
              ticks: {
                color: 'red'           // tick labels color
              },
              grid: {
                drawOnChartArea: false // keep only left grid
              },
              position: 'left',
              grid: {
                drawOnChartArea: false // ✅ Prevent grid overlap
              }
            }
          },
          plugins: {
            legend: { position: 'top' },
            tooltip: { 
              mode: 'index', 
              intersect: false,
              callbacks: {
                title: function(tooltipItems) {
                  // tooltipItems[0].parsed.x is a timestamp (ms) when parsing:false and x is Date
                  const d = new Date(tooltipItems[0].parsed.x);
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  const hours = String(d.getHours()).padStart(2, '0');
                  const minutes = String(d.getMinutes()).padStart(2, '0');
                  return `${year}-${month}-${day} ${hours}:${minutes}`;
                }
              }
            },
            // ✅ Annotation plugin for reference lines
            annotation: {
              annotations: {
                btLine: {
                  type: 'line',
                  yMin: 37.5,
                  yMax: 37.5,
                  borderColor: 'blue',
                  borderWidth: 2,
                  borderDash: [6, 6],
                  yScaleID: 'y1',
                  label: {
                    display: true,
                    content: 'BT 37.5°C',
                    color: 'blue',
                    position: 'end'
                  }
                },
                prLine: {
                  type: 'line',
                  yMin: 120,
                  yMax: 120,
                  borderColor: 'red',
                  borderWidth: 2,
                  borderDash: [6, 6],
                  yScaleID: 'y2',
                  label: {
                    display: true,
                    content: 'PR 120',
                    color: 'red',
                    position: 'end'
                  }
                }
              }
            }
          },
          
          interaction: { mode: 'nearest', intersect: false }
        }
      };

      chart = new Chart(ctx, config);
      charts.set(canvas, chart);
    }

    // Update data & refresh
    chart.data.datasets[0].data = dataBt;
    chart.data.datasets[1].data = dataPr;
    chart.update();
  }

  function destroy(canvas) {
    const chart = charts.get(canvas) || (Chart.getChart ? Chart.getChart(canvas) : null);
    if (chart) {
      try { chart.destroy(); } catch { /* ignore */ }
      charts.delete(canvas);
    }
  }

  return { initOrUpdate, destroy };
})();
