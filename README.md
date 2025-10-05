# PowerTech - Australian TV Energy Consumption Analysis

A data-driven website helping Australian consumers make informed decisions when purchasing energy-efficient televisions.

---

## 📖 Data Story

### Audience

**Primary Audience:** Australian consumers actively shopping for a new television or considering a TV upgrade.

**Audience Characteristics:**
- **Demographics:** Adults aged 25-65, homeowners and renters across all Australian states
- **Tech Savviness:** Mixed - from tech-enthusiastic early adopters to practical buyers seeking reliable information
- **Financial Awareness:** Cost-conscious consumers concerned about both upfront purchase price and long-term running costs
- **Environmental Consciousness:** Varying levels, from those primarily motivated by cost savings to environmentally-driven purchasers
- **Information Needs:** Want objective, data-driven guidance rather than sales pitches

### Their Interest in Our Visualization

**Why This Matters to Them:**

1. **Financial Impact:** Australian electricity prices are among the world's highest. With TVs accounting for 8-12% of household energy consumption, choosing an efficient model can save $100-200+ over a TV's 10-year lifespan.

2. **Choice Overload:** The Australian market offers 2,500+ TV models across multiple brands, sizes, and technologies. Consumers face analysis paralysis when trying to evaluate efficiency.

3. **Hidden Information:** Energy efficiency is often downplayed in marketing materials. Star ratings exist but aren't always prominently displayed or easily comparable across retailers.

4. **Long-term Investment:** TVs last 7-10 years. A decision made today affects electricity bills for a decade, but consumers typically focus only on purchase price.

**What They Want to Know:**
- Which screen technology is most energy-efficient?
- How much does screen size actually affect power consumption?
- Are certain brands consistently more efficient?
- Which TV sizes offer the best selection of efficient models?
- How do I find the best value considering both price and efficiency?

**How Our Visualizations Help:**

Our four data visualizations directly answer these questions by presenting:
1. **Technology Comparison** - Shows average power consumption across OLED, LCD (LED), LCD technologies
2. **Market Availability** - Reveals which screen sizes have the most options (more choice = better chance of finding efficient models)
3. **Size-Power Relationship** - Quantifies how power consumption scales with screen size
4. **Brand Efficiency Analysis** - Compares top brands' performance across different size categories

**The Storyboard Approach:**

Rather than dumping data on users, we guide them through a narrative:
1. **Issue:** Establish the challenge they face
2. **Demonstrate:** Show what the data reveals (the 4 visualizations)
3. **Insights:** Explain what the patterns mean
4. **Action Plan:** Teach them how to use the data when shopping
5. **Example:** Contrast data-informed vs. uninformed shopping
6. **Next Steps:** Provide actionable guidance for their purchase

This storytelling approach makes complex market analysis accessible and actionable for everyday consumers.

---

## 📊 About the Data

### Data Source

**Primary Dataset:** Australian TV Energy Database (2025)

**Dataset Contents:**
- **Records:** 2,500+ television models available in the Australian market
- **Variables Analyzed:**
  - Screen size (inches)
  - Screen technology (OLED, LCD (LED), LCD, Plasma)
  - Brand/Manufacturer
  - Power consumption (Watts)
  - Energy star rating (1-10 stars)
  - Model identifiers

**Data Collection Period:** 2025 market data

**Source Type:** Aggregated from publicly available sources including:
- Australian Energy Rating Labels (mandatory for all TVs sold in Australia)
- Manufacturer specifications
- Retailer product listings
- Equipment Energy Efficiency (E3) Program database

**Data Format:** Structured dataset (CSV format)

### Data Processing

**Processing Steps:**

1. **Data Cleaning:**
   - Removed duplicate model entries
   - Standardized brand names (e.g., "Samsung" vs "SAMSUNG" vs "Samsung Electronics")
   - Normalized screen size measurements (converted all to inches)
   - Corrected obvious data entry errors (e.g., 550W for a 55" TV changed to 55W)
   - Removed records with missing critical fields (size, technology, or power consumption)

2. **Data Transformation:**
   - Created screen size categories based on natural market clustering:
     - Small: ≤43"
     - Medium: 48-55"
     - Large: 60-70"
     - X-Large: ≥75"
   - Calculated average power consumption by technology type
   - Computed brand efficiency rankings within size categories
   - Generated frequency distributions for market availability analysis

3. **Data Validation:**
   - Cross-referenced power consumption values with manufacturer specifications
   - Verified star ratings against official Energy Rating Label database

4. **Aggregation:**
   - Calculated mean, median, and range for each technology type
   - Grouped models by brand and size for comparative analysis
   - Generated summary statistics for visualization

**Tools Used:**
- KNIME for data processing and generating SVG charts for visualization
- Statistical analysis for identifying patterns and outliers

### Privacy

**Privacy Considerations:**

**No Personal Data:** This dataset contains **zero personal information**. All data points represent:
- Physical product specifications (screen size, power consumption)
- Public manufacturer information (brand names, model numbers)
- Published energy ratings (publicly available on all Australian TVs)

**Compliance:**
- ✅ No collection of consumer behavior data
- ✅ No tracking of individual purchases
- ✅ No personally identifiable information (PII)
- ✅ No requirement for user accounts or data submission
- ✅ Fully compliant with Australian Privacy Principles (APPs)

**Data Usage:** All information is derived from publicly available product specifications and government-mandated energy labels. Consumers have the right to this information under Australian consumer protection laws.

### Accuracy and Limitations

**Accuracy:**

**Strengths:**
- ✅ Based on official Energy Rating Labels (mandatory government standard)
- ✅ Cross-referenced with manufacturer specifications
- ✅ Large sample size (2,500+ models) provides statistical reliability
- ✅ Represents actual Australian market (not international data)

**Known Limitations:**

1. **Power Consumption Variability:**
   - Figures represent "typical" usage as defined by Australian standards
   - Actual consumption varies based on:
     - Brightness settings (can vary 20-30%)
     - Content type (HDR content uses more power)
     - Smart features usage (streaming vs. broadcast)
     - Ambient light sensors and auto-brightness
   - **Impact:** Real-world consumption may differ ±15-25% from rated values

2. **Market Snapshot:**
   - Data represents 2025 market availability
   - New models continuously released
   - Discontinued models may still appear in dataset
   - **Impact:** Some models may no longer be available; new efficient models may not be included

3. **Brand Averages:**
   - Brand efficiency comparisons use averages across all models
   - Individual models within a brand vary significantly
   - Averages don't account for premium vs. budget lines
   - **Impact:** Brand comparison should guide shortlisting, not final decisions

4. **Size Categories:**
   - Categorization based on market clustering, not technical standards
   - Some sizes (e.g., 58", 60") may fit multiple categories
   - **Impact:** Edge cases may be categorized somewhat arbitrarily

5. **Technology Classification:**
   - Classification based on primary display technology
   - **Impact:** Some advanced hybrid models may not perfectly fit categories

6. **Missing Context:**
   - Dataset doesn't include:
     - Picture quality metrics
     - Smart TV features
     - Price information
     - Reliability/warranty data
   - **Impact:** Energy efficiency is only one factor in TV selection

**Confidence Levels:**
- **High confidence:** Technology type comparisons, size-power correlation
- **Medium confidence:** Brand efficiency rankings (due to model variation)
- **Lower confidence:** Exact real-world power consumption (due to usage variability)

**Recommendations for Users:**
- Use our analysis for comparative shopping, not absolute predictions
- Always check the Energy Rating Label on specific models
- Calculate energy costs using YOUR actual viewing habits
- Consider multiple factors beyond efficiency (price, features, quality)

### Ethics

**Ethical Considerations:**

**1. Transparency and Honesty**

**Our Commitment:**
- ✅ Clearly state data sources and limitations
- ✅ No hidden relationships with manufacturers or retailers
- ✅ Present data objectively without cherry-picking results
- ✅ Acknowledge uncertainty and variability in findings

**Potential Concerns:**
- ⚠️ Visualization design choices can emphasize certain patterns
- ⚠️ Aggregation may obscure individual model performance

**Our Mitigation:**
- Display individual data points (scatter plot) alongside averages
- Use neutral color schemes, not emotionally manipulative design
- Provide methodology so users can understand our approach
- Encourage users to verify findings with specific product research

**2. Fairness and Bias**

**Potential Biases:**
- Dataset may over-represent models from major retailers
- Popular brands may have more models, skewing brand comparisons
- Newer technologies (OLED, QLED) may be over-represented in efficient ranges due to recent development

**Our Mitigation:**
- Acknowledge these biases in methodology section
- Use both raw counts and averages in brand analysis
- Present technology comparison as "what's available" not "what you must buy"
- Don't exclude any technology types or brands from analysis

**3. Consumer Empowerment vs. Manipulation**

**Ethical Principle:** Inform, don't manipulate

**What We Do:**
- ✅ Provide objective data so consumers can make informed choices
- ✅ Teach users how to read and apply data visualizations
- ✅ Present multiple factors (technology, size, brand) not just "buy this one"
- ✅ Acknowledge that energy efficiency is ONE factor among many

**What We Avoid:**
- ❌ Fear-mongering about electricity costs
- ❌ Shaming consumers for preferring larger screens
- ❌ Promoting specific brands or models
- ❌ Creating artificial urgency ("buy now before prices rise!")

**4. Environmental Responsibility**

**Ethical Consideration:** Does promoting energy efficiency actually help the environment?

**Our Position:**
- ✅ Reducing electricity consumption lowers carbon emissions (Australian grid still heavily fossil-fuel dependent)
- ✅ Helping consumers keep TVs longer (by making good first choices) reduces electronic waste
- ✅ Energy-efficient models often correlate with better build quality and longer lifespan

**Acknowledged Complexity:**
- Manufacturing impact isn't considered in our analysis
- Most energy savings occur if consumers were buying a TV anyway
- "Rebound effect" - saved money might be spent on other energy-intensive goods

**Our Approach:**
- Present efficiency as ONE valid criterion, not a moral imperative
- Don't claim environmental superiority without evidence
- Focus on practical consumer benefits (cost savings) alongside environmental ones

**5. Accessibility and Inclusion**

**Ethical Obligation:** Make information accessible to all consumers

**Our Implementation:**
- ✅ Simple, minimalist website design (accessible to older browsers)
- ✅ Clear language avoiding technical jargon
- ✅ Multiple ways to access information (text, tables, visualizations)
- ✅ Mobile-responsive design (accessible on any device)

**Considerations:**
- Color coding in charts uses colorblind-safe palettes
- Text alternatives provided for all visualizations (chart captions)
- No requirement for user accounts or payment to access information

**6. Commercial Relationships**

**Disclosure:** 
- This is an educational project demonstrating data visualization for consumer decision-making
- No commercial partnerships with TV manufacturers, retailers, or energy companies
- No affiliate links or commissioned sales
- No advertising revenue

**If This Were Commercial:**
- We would need to disclose any financial relationships
- Clear separation between content and advertising
- No "editorial content" that's actually paid promotion
- Transparency about how we make money

---

## 🚀 Project Structure

```
energy-webpage-v1/
├── index.html          # Main HTML file with all 4 pages
├── styles.css          # CSS with design system (color variables, storyboard styling)
├── scripts.js          # JavaScript for navigation and interactivity
├── images/
│   └── PowerIcon.png   # Logo image
└── README.md           # This file
```

---

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Custom properties (variables) for maintainable styling
- **Vanilla JavaScript** - No dependencies, lightweight navigation
- **SVG** - Scalable vector graphics for data visualizations

---

## 📱 Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Four separate pages with smooth navigation
- ✅ Data-driven storyboard narrative structure
- ✅ Placeholders for four key data visualizations
- ✅ Production-ready code with CSS variables
- ✅ Accessible design with semantic HTML
- ✅ No external dependencies

---

## 🎨 Design Philosophy

**1. Minimalist Aesthetic**
- Inspired by 1990s web design for simplicity and focus
- Brown/cream/orange color scheme matching brand identity
- Times serif font for readability and classic feel

**2. Data First**
- Visualizations are the centerpiece, not decorative elements
- Clear hierarchy guides users through narrative
- Numbered storyboard sections create logical flow

**3. User-Centered**
- Content written for real consumers, not data scientists
- Practical guidance over theoretical explanations
- Honest about limitations and uncertainties

---

## 📄 License

This project is created for educational purposes as part of a web development and data visualization course.

**Data Usage:** All product data is derived from publicly available sources. Energy ratings are mandated by Australian government standards and are public information.

**Code:** Available for educational reference. If adapting for commercial use, ensure compliance with relevant consumer protection laws and data usage regulations.

---

**Acknowledgments:**
- Website content and structure developed with assistance from Claude AI (Anthropic)
- Data visualization concepts based on principles from Edward Tufte and Alberto Cairo
- Australian energy data sourced from publicly available government and manufacturer specifications

## GenAI Usage Declaration

### Generative AI Assistance
This project was developed with assistance from Generative Artificial Intelligence tools, specifically Claude (Anthropic). The GenAI was used to support various aspects of the development process including:

- **Code Development**: Assistance with JavaScript functions, D3.js implementation, and CSS styling
- **Problem Solving**: Help with debugging, optimization, and best practices
- **Documentation**: Support in creating clear and comprehensive documentation
- **Git Workflow**: Guidance on version control, branching strategies, and GitHub Pages deployment

## Author
**Student**: Le Hoang Long - SWS01138/ 104845140  
**Course**: COS30045 - Data Visualization  
**Institution**: Swinburne Vietnam

---

*Last Updated: September 2025*