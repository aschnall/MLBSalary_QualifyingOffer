import requests
import statistics
import sys
from bs4 import BeautifulSoup
import collections
collections.Callable = collections.abc.Callable
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def home():
    # parse HTML from link and isolate salaries
    # citing the following link which I followed in order to parse the HTML data using Beautiful Soup
    # https://www.twilio.com/blog/web-scraping-and-parsing-html-in-python-with-beautiful-soup
    data_url = 'https://questionnaire-148920.appspot.com/swe/data.html'
    html_text = requests.get(data_url).text
    soup = BeautifulSoup(html_text, 'html.parser')
    salaries = soup.find_all('td', attrs={'class': 'player-salary'})

    # traverse salaries, clean, convert to ints, and add to list
    all_salaries = []
    min_sal = sys.maxsize
    for salary in salaries:
        cur_salary = salary.get_text()
        cur_salary = cur_salary.replace("$", "")
        cur_salary = cur_salary.replace(",", "")
        try:
            cur_salary_int = int(cur_salary)
            all_salaries.append(cur_salary_int)
            if cur_salary_int < min_sal:
                min_sal = cur_salary_int
        except ValueError:
            continue

    # sort salaries and get total number of players
    all_salaries.sort(reverse=True)
    num_players = len(all_salaries)

    # isolate/calculate top 125 salaries
    top125_salary_sum = 0
    top_125_sals = []
    max_sal = all_salaries[0]
    for i in range(125):
        top125_salary_sum += all_salaries[i]
        top_125_sals.append(all_salaries[i])
    top125_min = top_125_sals[-1]

    # calculate qualifying offer
    qualifying_offer = top125_salary_sum / 125
    qo_rank = 1
    
    # isolate/calculate non-min salaries
    non_min_salary_sum = 0
    non_min_sals = []
    for i in range(len(all_salaries)):
        if all_salaries[i] == min_sal:
            break
        non_min_salary_sum += all_salaries[i]
        non_min_sals.append(all_salaries[i])
        if all_salaries[i] > qualifying_offer:
            qo_rank += 1
    non_min_min = non_min_sals[-1]

    # calculate medians
    top_125_med = statistics.median(top_125_sals)
    all_med = statistics.median(all_salaries)
    non_min_med = statistics.median(non_min_sals)

    # calculate means
    top_125_mean = statistics.mean(top_125_sals)
    all_mean = statistics.mean(all_salaries)
    non_min_mean = statistics.mean(non_min_sals)

    # format numbers for display
    # citing the following link for assistance with translating to currency strings
    # https://stackabuse.com/format-number-as-currency-string-in-python/
    qualifying_offer_fmt = format_numbers(True, qualifying_offer)
    top_125_mean_fmt = format_numbers(True, top_125_mean)
    all_mean_fmt = format_numbers(True, all_mean)
    top_125_med_fmt = format_numbers(True, top_125_med)
    all_med_fmt = format_numbers(True, all_med)
    num_players_fmt = format_numbers(False, num_players)
    non_min_med_fmt = format_numbers(True, non_min_med)
    non_min_mean_fmt = format_numbers(True, non_min_mean)
    non_min_players_fmt = format_numbers(False, len(non_min_sals))
    non_min_min_fmt = format_numbers(True, non_min_min)
    max_sal_fmt = format_numbers(True, max_sal)
    top125_min_fmt = format_numbers(True, top125_min)
    min_sal_fmt = format_numbers(True, min_sal)

    # bundling all data into object to use on the front end
    data = {
        'qual_off': qualifying_offer_fmt, 
        'num_players': num_players_fmt,
        'non_min_players': non_min_players_fmt, 
        'top_125_med': top_125_med_fmt, 
        'all_med': all_med_fmt, 
        'top_125_mean': top_125_mean_fmt,
        'all_mean': all_mean_fmt, 
        'non_min_mean': non_min_mean_fmt,
        'non_min_med': non_min_med_fmt,
        'all_sals': all_salaries,
        'top125_sals': top_125_sals,
        'non_min_sals': non_min_sals,
        'top_125_max': max_sal_fmt,
        'top_125_min': top125_min_fmt,
        'non_min_min': non_min_min_fmt,
        'non_min_max': max_sal_fmt,
        'all_max': max_sal_fmt,
        'all_min': min_sal_fmt,
        'qo_rank': qo_rank
    }

    return render_template("index.html", data=data)

# helper function for formatting numbers to display on frontend
def format_numbers(currency, num):
    if currency:
        num_fmt = "${:,.2f}".format(num)
        return num_fmt[0:len(num_fmt)-3]
    else:
        num_fmt = "{:,.2f}".format(num)
        return num_fmt[0:len(num_fmt)-3]