# Objective: Scrape box score data for all 73 games from https://www.basketball-reference.com/teams/PHO/2020_games.html

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
# from selenium.webdriver.support.ui import Select

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

import pandas as pd
import time
from datetime import datetime

driver = webdriver.Chrome(executable_path='/Users/anaygupta/Downloads/chromedriver')

boxScore = driver.find_elements_by_xpath('//*[@id="games"]/tbody/tr[1]/td[4]/a')
driver.execute_script("arguments[0].click();", boxScore[0])

downloadButton=driver.find_element_by_xpath('//*[@id="all_box-PHO-game-basic"]/div[1]/div/ul/li[1]/div/ul/li[4]/button')
driver.execute_script("arguments[0].click();", downloadButton[0])
