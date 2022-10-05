const ctxAll = document.getElementById('histogram-all').getContext('2d');
const ctxTop125 = document.getElementById('histogram-top125').getContext('2d');
const ctxNonMin = document.getElementById('histogram-nonmin').getContext('2d');
const noteElem = document.getElementById('note');
const notePart1 = 'Note: The Qualifying Offer would\'ve ranked as the ';
const notePart2 = 'highest salary in the MLB in 2016';

// parse data received from backend received as string - convert to array
allSalData = allSalData.slice(1,allSalData.length-1)
allSalDataArr = allSalData.split(',')
top125SalData = top125SalData.slice(1,top125SalData.length-1)
top125SalDataArr = top125SalData.split(',')
nonMinSalData = nonMinSalData.slice(1,nonMinSalData.length-1)
nonMinSalDataArr = nonMinSalData.split(',')

allSalHist = calculateRanges(allSalDataArr)
top125SalHist = calculateRanges(top125SalDataArr)
nonMinSalHist = calculateRanges(nonMinSalDataArr)
determineRank(qoRank)

// determine the ending for the qual offer rank
function determineRank(qo_rank) {
    if (qo_rank % 10 == 1) {
        noteElem.textContent = notePart1 + qoRank + "st " + notePart2;
    } else if (qo_rank % 10 == 2) {
        noteElem.textContent = notePart1 + qoRank + "nd " + notePart2;
    } else if (qo_rank % 10 == 3) {
        noteElem.textContent = notePart1 + qoRank + "rd " + notePart2;
    } else {
        noteElem.textContent = notePart1 + qoRank + "th " + notePart2;
    }
}

// function to calculate salary ranges for histogram
function calculateRanges(salData) {
    salHist = Array(8).fill(0)
    for (let i = 0; i < salData.length; i++) {
        curSal = parseInt(salData[i])
        switch (true) {
            case (curSal >= 1000000 && curSal < 5000000):
                salHist[1]++
                break;
            case (curSal >= 5000000 && curSal < 10000000):
                salHist[2]++
                break;
            case (curSal >= 10000000 && curSal < 15000000):
                salHist[3]++
                break;
            case (curSal >= 15000000 && curSal < 20000000):
                salHist[4]++
                break;
            case (curSal >= 20000000 && curSal < 25000000):
                salHist[5]++
                break;
            case (curSal >= 25000000 && curSal < 30000000):
                salHist[6]++
                break;
            case (curSal >= 30000000):
                salHist[7]++
                break;
            default:
                salHist[0]++
                break;
        }
    }
    return salHist
}

// create the historgrams
// citing following link which I followed in order to create histograms with Chart.js
// https://www.educative.io/answers/chartjs---create-a-histogram
// also citing this link which helped with configuring the height of the charts
// https://stackoverflow.com/questions/41953158/set-height-of-chart-in-chart-js
const chartTop125 = new Chart(ctxTop125, {
    type: 'bar',
    data: {
      labels: ['<1M', '1M-5M', '5M-10M', '10M-15M', '15M-20M', '20M-25M', '25M-30M', '30M+'],
      datasets: [{
        label: 'Number of Players in Salary Range',
        data: top125SalHist,
        backgroundColor: 'grey',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
        display: true,
        text: 'Histogram of Top 125 Player Salaries'
      },
      },
      scales: {
        xAxes: [{
          display: false,
          barPercentage: 1.3,
          ticks: {
            max: 3,
          }
        }, {
          display: true,
          ticks: {
            autoSkip: false,
            max: 4,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

const chartAll = new Chart(ctxAll, {
  type: 'bar',
  data: {
    labels: ['<1M', '1M-5M', '5M-10M', '10M-15M', '15M-20M', '20M-25M', '25M-30M', '30M+'],
    datasets: [{
      label: 'Number of Players in Salary Range',
      data: allSalHist,
      backgroundColor: 'grey',
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
      display: true,
      text: 'Histogram of All Player Salaries'
    },
    },
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 1.3,
        ticks: {
          max: 3,
        }
      }, {
        display: true,
        ticks: {
          autoSkip: false,
          max: 4,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

const chartNonMin = new Chart(ctxNonMin, {
    type: 'bar',
    data: {
      labels: ['<1M', '1M-5M', '5M-10M', '10M-15M', '15M-20M', '20M-25M', '25M-30M', '30M+'],
      datasets: [{
        label: 'Number of Players in Salary Range',
        data: nonMinSalHist,
        backgroundColor: 'grey',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
        display: true,
        text: 'Histogram of Non-Minimum Player Salaries'
      },
      },
      scales: {
        xAxes: [{
          display: false,
          barPercentage: 1.3,
          ticks: {
            max: 3,
          }
        }, {
          display: true,
          ticks: {
            autoSkip: false,
            max: 4,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });