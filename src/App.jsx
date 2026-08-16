import { useState } from "react";

const models = [
  {
    name: "Transparent baseline",
    ap: 0.3476,
    p20: 0.320,
    p50: 0.344,
    role: "Transparent comparator",
  },
  {
    name: "Logistic Regression",
    ap: 0.3171,
    p20: 0.330,
    p50: 0.304,
    role: "Linear learned reference",
  },
  {
    name: "Random Forest",
    ap: 0.3616,
    p20: 0.390,
    p50: 0.368,
    role: "Selected development model",
  },
  {
    name: "HistGradientBoosting",
    ap: 0.3575,
    p20: 0.320,
    p50: 0.352,
    role: "Close nonlinear alternative",
  },
];


const features = [
  "imp_early30",
  "imp_middle30",
  "imp_recent30",
  "clk_recent30",
  "pos_recent30",
  "imp_change_middle_vs_early",
  "imp_change_recent_vs_middle",
  "ctr_middle30",
  "ctr_recent30",
  "ctr_change_recent_vs_middle",
  "pos_change_recent_vs_middle",
  "days_with_impressions_90",
  "imp_cv_90",
  "recent_position_available",
];


const repoUrl = "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/";

const notebookLinks = [
  { week: "Week 1", title: "Research question", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w01_research_question.ipynb" },
  { week: "Week 2", title: "ML task framing", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w02_ml_task_framing.ipynb" },
  { week: "Week 3", title: "Data contract", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w03_data_contract.ipynb" },
  { week: "Week 4", title: "Baseline score", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w04_baseline_score.ipynb" },
  { week: "Week 5", title: "Model", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w05_model.ipynb" },
  { week: "Week 6", title: "Validation audit", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w06_validation_audit.ipynb" },
  { week: "Week 7", title: "Action playbook", href: "https://github.com/stfnnnnnnn/karl-mangahas-flyrank/blob/main/work/notebooks/w07_action_playbook.ipynb" },
];


const reasonCodes = [
  {
    code: "top50_model_rank",
    title: "Top-50 model rank",
    meaning:
      "The page falls within the first 50 positions of the model-ranked review queue.",
    use:
      "This identifies pages that would be reached under a review capacity of 50 pages.",
  },
  {
    code: "high_model_rank",
    title: "High model rank",
    meaning:
      "The page falls within the high end of the model ranking.",
    use:
      "This indicates elevated model priority, but it is not a diagnosis of why the page may later decline.",
  },
  {
    code: "meaningful_visibility",
    title: "Meaningful visibility",
    meaning:
      "The page had substantial recent historical search visibility.",
    use:
      "Higher historical visibility can make a potential decline more consequential for review prioritization.",
  },
  {
    code: "page_one_exposure",
    title: "Page-one exposure",
    meaning:
      "The page recently had historical average search position within page-one range.",
    use:
      "Strong-ranking pages may deserve protection and diagnosis before consequential edits are considered.",
  },
  {
    code: "earlier_impression_weakening",
    title: "Earlier impression weakening",
    meaning:
      "Historical impressions weakened between the earlier and middle historical windows.",
    use:
      "This provides historical movement context without using the later outcome period.",
  },
  {
    code: "historical_position_worsening",
    title: "Historical position worsening",
    meaning:
      "Average search position became weaker across the historical windows.",
    use:
      "This can help explain why a page was surfaced for investigation, but does not establish the cause of later decline.",
  },
  {
    code: "weak_click_capture",
    title: "Weak click capture",
    meaning:
      "The page had meaningful historical visibility but relatively weak historical CTR under the playbook rule.",
    use:
      "This can prompt inspection of title, snippet, and search-intent alignment rather than an automatic metadata change.",
  },
  {
    code: "limited_evidence",
    title: "Limited evidence",
    meaning:
      "The page has comparatively weaker historical evidence for confident action.",
    use:
      "The conservative response is generally to monitor or investigate further rather than immediately edit the page.",
  },
];


function App() {
  const [metric, setMetric] = useState("ap");
  const [reasonIndex, setReasonIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const metricInfo = {
    ap: {
      title: "Mean Average Precision",
      short: "AP",
      explanation:
        "Average Precision evaluates ranking quality across the precision-recall curve. It was declared before examining the final results as the primary model-selection metric.",
    },

    p20: {
      title: "Mean Precision@20",
      short: "P@20",
      explanation:
        "Precision@20 asks how many of the first 20 reviewed pages later meet the decline definition. It represents a very limited editorial review capacity.",
    },

    p50: {
      title: "Mean Precision@50",
      short: "P@50",
      explanation:
        "Precision@50 asks how many of the first 50 reviewed pages later meet the decline definition. It is an operational metric for a larger review capacity.",
    },
  };

  const maxValue = Math.max(
    ...models.map((model) => model[metric])
  );

  return (
    <>
      <header className="site-header">
        <div className="nav-shell">

          <a className="brand" href="#top" aria-label="FlyRank Research">
            <span className="brand-name">
              FlyRank
            </span>

            <span className="brand-divider" />

            <span className="brand-research">
              Research
            </span>
          </a>


          <button
            className="menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle navigation"
          >
            ☰
          </button>


          <nav className={menuOpen ? "nav-links open" : "nav-links"}>
            <a href="#abstract">Abstract</a>
            <a href="#problem">Problem</a>
            <a href="#data">Data</a>
            <a href="#model">Methodology</a>
            <a href="#evaluation">Results</a>
            <a href="#recommendations">Recommendations</a>
            <a href="#limitations">Limitations</a>
            <a href="#reproducibility">Reproduce</a>
          </nav>

        </div>
      </header>


      <main id="top">

        <Hero />


        <section className="headline-results">

          <Metric
            value="0.3616"
            label="Mean grouped-CV AP"
          />

          <Metric
            value="36.8%"
            label="Random Forest P@50"
          />

          <Metric
            value="34.4%"
            label="Baseline P@50"
          />

          <Metric
            value="30.04%"
            label="Mean fold base rate"
          />

        </section>


        <section className="main-finding">

          <span className="eyebrow">
            Main finding
          </span>

          <h2>
            Useful signal.
            Modest improvement.
            Human decision.
          </h2>

          <p>
            Historical search behavior
            provided measured,
            directional value for
            prioritizing apparently
            stable pages for earlier
            review. The learned-model
            advantage over the
            transparent baseline was
            modest and varied across
            held-out clients.
          </p>

          <p>
            The evidence supports
            <strong>
              {" "}review prioritization
            </strong>,
            not autonomous editorial
            intervention.
          </p>

        </section>


        <PaperSection
          id="abstract"
          number="0"
          label="Abstract"
          title="Can historical search behavior identify which apparently stable pages deserve earlier human review?"
        >
          <p>
            This project addresses a practical FlyRank content-review problem:
whether historical search behavior can help content teams prioritize
which apparently stable pages deserve earlier human review before a
later decline in search visibility.
          </p>
          <p>
            Using the pseudonymized FlyRank ML Internship dataset, I constructed a page-level ranking framework from a 90-day historical feature period followed by a separate 30-day outcome window, with eligibility controls for visibility, history coverage, tracking availability, and recent impression stability.
          </p>
          <p>
            A transparent historical baseline, Logistic Regression, Random Forest, and HistGradientBoosting were evaluated using client-grouped validation, with mean Average Precision declared in advance as the model-selection criterion.
          </p>
          <p>
            Random Forest produced the strongest final grouped-validation evidence, achieving mean Average Precision of <strong>0.3616</strong>, Precision@20 of <strong>39.0%</strong>, and Precision@50 of <strong>36.8%</strong>, compared with baseline Average Precision of <strong>0.3476</strong> and Precision@50 of <strong>34.4%</strong>.
          </p>
          <p>
            The results provide measured but variable evidence that historical search signals can improve the ordering of a limited human-review queue, but they do not support autonomous editorial decisions or claims of reliable future-period generalization.
          </p>
        </PaperSection>


        <PaperSection
          id="problem"
          number="1"
          label="Problem framing"
          title="Which page should a human inspect first?"
        >
          <p className="case-study-intro">
            FlyRank researches, publishes, monitors, and optimizes content across
            client websites. At that scale, the practical content problem is not
            whether every page can be manually inspected, but <strong>which page
            deserves human attention first</strong> when search performance may
            be starting to weaken.
          </p>
          <blockquote className="research-question">
            <span className="research-question-label">
              Research Question
            </span>

            <p>
              Among pages with sufficient historical evidence that
              appear stable at the decision point, which pages should
              a content manager review first because they show elevated
              risk of a later visibility decline?
            </p>
          </blockquote>


          <div className="three-column">

            <InfoCard
              title="Unit of analysis"
              text="One pseudonymized content page."
            />

            <InfoCard
              title="Output"
              text="A continuous decline-risk score converted into a ranked review queue."
            />

            <InfoCard
              title="Human action"
              text="Inspect the highest-priority pages, diagnose the context, then act, monitor, or dismiss."
            />

          </div>


          <h3>
            Why ranking instead of only
            classification?
          </h3>

          <p>
            Editorial capacity is
            limited. The practical value
            of the model therefore
            depends on whether declining
            pages are concentrated near
            the top of the queue.
          </p>

          <p>
            A high-ranked actual negative
            can waste review capacity.
            A low-ranked actual positive
            can represent a page that
            later declines without
            receiving early attention.
          </p>
          <div className="paper-depth-grid">
            <div className="paper-depth-card">
              <span className="eyebrow">Original project intent</span>
              <h3>Earlier attention, not post-decline detection.</h3>
              <p>The project began from the practical limitation that content teams cannot manually inspect every page. The useful decision is therefore not simply whether a page has already declined, but which pages deserve earlier attention while the available historical evidence still appears sufficiently stable.</p>
            </div>
            <div className="paper-depth-card">
              <span className="eyebrow">Cost of a wrong call</span>
              <h3>Both ranking errors matter.</h3>
              <p>A false high-priority recommendation consumes limited editorial time and can encourage unnecessary changes to a healthy page. A missed decline means a page that later deteriorates may not receive early investigation.</p>
            </div>
          </div>
          <div className="paper-prose">
            <h3>Decision boundary</h3>
            <p>The intended output has remained a <strong>ranked human-review queue</strong>, not an automatic content action. A surfaced page should be diagnosed by a person before deciding whether to monitor, protect, update, rewrite, merge, redirect, prune, or take no action.</p>
            <p>This also sets the claim boundary for the project. Historical signals can provide observed, measured, directional evidence for review prioritization; they cannot establish that a signal caused the decline, predict Google's ranking algorithm, or prove that refreshing a surfaced page will recover traffic.</p>
          </div>

        </PaperSection>


        <PaperSection
          id="data"
          number="2"
          label="Data safety"
          title="Historical evidence is kept separate from the later outcome."
          tinted
        >

          <div className="stat-grid">

            <Metric
              value="78,835,655"
              label="daily performance rows"
            />

            <Metric
              value="519,606"
              label="content items"
            />

            <Metric
              value="104"
              label="warehouse clients"
            />

            <Metric
              value="2025–2026"
              label="warehouse period"
            />

          </div>


          <div className="data-source-card">
            <div>
              <span className="eyebrow">Warehouse release</span>
              <h3>FlyRank pseudonymized internship warehouse</h3>
              <p>
                Source: <code>hf://datasets/FlyRank/internship-warehouse</code>. Recorded warehouse build: <code>flyrank_pseudonymized_warehouse_release_v20260703</code>.
              </p>
            </div>
            <div className="source-table-list">
              <div>
                <code>fact_content_daily_performance</code>
                <span>Daily GSC impressions, clicks, average position, and the historical/outcome windows used by the final model.</span>
              </div>
              <div>
                <code>dim_clients</code>
                <span>Client-level GSC tracking start used to verify sufficient history before the feature window.</span>
              </div>
            </div>
          </div>

          <p className="scope-note">
            The final development endpoint is <strong>March 31, 2026</strong>, with a <strong>March 1, 2026 decision point</strong> and historical features beginning <strong>December 1, 2025</strong>. The final predictive frame is built from page-level historical windows; outcome-period measurements are kept separate.
          </p>

          <h3>
            Development timeline
          </h3>

          <Timeline />


          <h3>
            Final development population
          </h3>

          <p>
            The final Week 7 development
            population contains
            <strong>
              {" "}16,183 eligible pages
            </strong>
            across
            <strong>
              {" "}24 clients
            </strong>,
            with an observed decline
            base rate of approximately
            <strong>
              {" "}28.58%
            </strong>.
          </p>


          <div className="two-column">

            <div>

              <h3>
                Eligibility
              </h3>

              <Check>
                At least 100 recent
                historical impressions
              </Check>

              <Check>
                At least 60 observed
                history days
              </Check>

              <Check>
                Client GSC tracking
                predates the historical
                feature window
              </Check>

              <Check>
                Recent historical
                impressions remain within
                ±20% of the preceding
                historical block
              </Check>

            </div>


            <div className="definition-card">

              <span className="eyebrow">
                Important definition
              </span>

              <h3>
                Stable-at-decision does
                not mean universally
                healthy.
              </h3>

              <p>
                Stability refers only to
                the declared
                impressions-based
                eligibility rule. It does
                not certify content
                quality, intent fit,
                ranking health, or future
                performance.
              </p>

            </div>

          </div>


          <h3>
            Target
          </h3>

          <pre>
{`is_declining = 1
when
imp_outcome30 < 0.80 × imp_recent30`}
          </pre>


          <h3>
            Deliberate exclusions
          </h3>

          <p>
            Outcome-period measurements,
            the decline outcome itself,
            client and content IDs, and
            existing product decision
            flags are excluded from the
            predictive feature set.
          </p>

          <p>
            IDs remain available only for
            grouping, joining, and
            reviewer traceability.
          </p>

        </PaperSection>


        <PaperSection
          id="baseline"
          number="3"
          label="Baseline"
          title="A learned model should earn its complexity."
        >

          <p>
            The transparent comparator
            uses historical weakening,
            position deterioration, and
            meaningful visibility to
            create an interpretable
            review-priority score.
          </p>

          <p>
            Baseline parameters and
            normalization values are
            estimated from training
            clients only before scoring
            held-out clients.
          </p>


          <div className="baseline-results">

            <Metric
              value="0.3476"
              label="Mean grouped-CV AP"
            />

            <Metric
              value="34.4%"
              label="Mean Precision@50"
            />

            <Metric
              value="30.04%"
              label="Mean fold base rate"
            />

          </div>


          <p>
            The baseline already contains
            useful ranking information.
            That makes it a meaningful
            standard rather than an
            intentionally weak comparator.
          </p>

        </PaperSection>


        <PaperSection
          id="model"
          number="4"
          label="Model / analysis"
          title="Binary classification is used to build a ranked review queue."
        >

          <p>
            The classifiers estimate the
            probability of the later
            decline outcome. Those
            probabilities are used as
            continuous ranking scores,
            rather than automatic
            positive/negative editorial
            decisions.
          </p>


          <div className="method-rationale">
            <div className="method-rationale-copy">
              <span className="eyebrow">Method choice</span>
              <h3>Why use classification for a ranking task?</h3>
              <p>The observed label is binary because each eligible page either does or does not cross the later decline threshold. The practical objective, however, is ranking: predicted probabilities order pages from higher to lower review priority so a content team can inspect only the first part of the queue.</p>
              <p>Random Forest was a suitable learned candidate because relationships among historical impressions, clicks, CTR, position, and their recent changes are not assumed to be purely linear. It also provides fitted feature-importance diagnostics that help describe what the model relied on, while the transparent baseline remains the standard that added complexity must beat.</p>
            </div>
            <div className="method-principles">
              <div><strong>Binary outcome</strong><span>Later impressions fall by more than 20% relative to the most recent historical block.</span></div>
              <div><strong>Continuous decision score</strong><span>Predicted probabilities determine review order rather than an automatic edit/no-edit decision.</span></div>
              <div><strong>Complexity must earn its place</strong><span>The learned model is compared with the transparent baseline under the same client-grouped evaluation design.</span></div>
            </div>
          </div>

          <div className="model-grid">

            {models.map((model) => (

              <ModelCard
                key={model.name}
                model={model}
              />

            ))}

          </div>


          <h3>
            Historical predictors
          </h3>

          <div className="feature-list">

            {features.map((feature) => (
              <code key={feature}>
                {feature}
              </code>
            ))}

          </div>

          <div className="paper-prose compact-prose">
            <h3>What the historical window lets the model see</h3>
            <p>The 90-day feature period is divided into three 30-day blocks. This preserves the original early-review intent while allowing the model to represent both historical levels and pre-decision movement in impressions, clicks, CTR, and average position.</p>
            <p>A page enters the final population only when its most recent historical impressions remain within ±20% of the preceding block, alongside the minimum visibility, history-coverage, and tracking-history requirements. This is an operational definition of <strong>stable at the decision point</strong>, not a universal definition of content health.</p>
          </div>

          <h3>
            Model-selection rule
          </h3>

          <div className="selection-rule">

            <strong>
              Select the learned model
              with the highest mean
              client-grouped
              cross-validation Average
              Precision.
            </strong>

            <p>
              Then require mean
              Precision@50 to exceed both
              the contemporary decline
              base rate and the
              transparent baseline before
              describing the selected
              model as operationally
              useful.
            </p>

          </div>

          <div className="method-audit-grid">
            <InfoCard
              title="Validation design"
              text="Five-fold GroupKFold holds out whole clients for model selection and robustness. A separate fixed six-client grouped holdout supports queue construction and concrete diagnostics."
            />
            <InfoCard
              title="Leakage control"
              text="Outcome-period measurements and the decline label are excluded from predictors; imputation and baseline parameters are estimated inside the training fold or training partition."
            />
            <InfoCard
              title="Selection discipline"
              text="Mean grouped-CV Average Precision is the predeclared selection criterion. Precision@20 and Precision@50 remain operational diagnostics."
            />
          </div>

        </PaperSection>


        <PaperSection
          id="evaluation"
          number="5"
          label="Evaluation"
          title="Random Forest leads the declared criterion and the primary grouped-CV review capacities."
          dark
        >

          <p>
            Five-fold GroupKFold
            validation holds out whole
            clients. This tests whether
            ranking behavior transfers to
            pages belonging to clients
            that were not used to train
            that fold's model.
          </p>
          <div className="results-reading">
            <div>
              <span className="eyebrow">How to read the metrics</span>
              <h3>Whole-ranking quality and review-capacity quality answer different questions.</h3>
              <p>Average Precision evaluates ranking quality across the precision-recall curve and is the predeclared model-selection criterion. Precision@20 and Precision@50 ask a narrower operational question: how concentrated are later-declining pages among the first 20 or 50 recommendations a reviewer could realistically inspect?</p>
            </div>
            <div>
              <span className="eyebrow">Why report lift?</span>
              <h3>Top-K precision needs prevalence context.</h3>
              <p>Lift compares Precision@K with the contemporary decline base rate. A value above <strong>1.0×</strong> means the top of the queue contains a higher proportion of later-declining pages than the underlying evaluation population.</p>
            </div>
          </div>


          <MetricExplorer
            metric={metric}
            setMetric={setMetric}
            metricInfo={metricInfo}
            maxValue={maxValue}
          />


          <div className="selection-explanation">

            <div>

              <span className="eyebrow">
                Why Random Forest?
              </span>

              <h3>
                It won the metric chosen
                before the final results
                were inspected.
              </h3>

              <p>
                Random Forest achieved
                mean AP of
                <strong> 0.3616</strong>,
                compared with
                <strong> 0.3575</strong>
                for
                HistGradientBoosting.
              </p>

            </div>


            <div>

              <span className="eyebrow">
                Why this is not a
                dominant win
              </span>

              <h3>
                Random Forest also leads
                the primary grouped-CV
                review capacities.
              </h3>

              <p>
                Mean Precision@20 was
                <strong>{" "}39.0%</strong>
                for Random Forest versus
                <strong>{" "}32.0%</strong>
                for HistGradientBoosting.
              </p>

              <p>
                Mean Precision@50 was
                <strong>{" "}36.8%</strong>
                for Random Forest versus
                <strong>{" "}35.2%</strong>
                for HistGradientBoosting.
              </p>

            </div>

          </div>


          <div className="research-note">

            <h3>
              Why keep Average Precision
              as the selection rule?
            </h3>

            <p>
              Average Precision was
              declared as the primary
              selection criterion before
              examining the final model
              results. Random Forest also
              leads P@20 and P@50 in this
              execution, but those metrics
              remain operational diagnostics
              rather than replacement
              selection criteria.
            </p>

            <p>
              The correct conclusion is
              still not that Random Forest
              is universally the best
              algorithm. It is the
              best-supported development
              model under the predeclared
              rule, while substantial
              fold-to-fold variability keeps
              the evidence directional.
            </p>

          </div>


          <h3>
            Variability
          </h3>

          <p>
            Random Forest's grouped-CV
            Average Precision had a
            standard deviation of
            approximately
            <strong> 0.1585</strong>.
            Precision@50 averaged
            <strong> 36.8%</strong>
            with a standard deviation of
            approximately
            <strong>{" "}18.85 percentage points</strong>.
          </p>


          <h3>
            Fixed six-client holdout
          </h3>

          <p className="holdout-context">The fixed grouped holdout serves a different purpose from cross-validation. It supports the concrete reviewer-facing queue, individual ranking-error examples, and client-level diagnostics. It does <strong>not</strong> replace grouped cross-validation as the basis for model selection.</p>

          <div className="holdout-grid">

            <Metric
              value="0.620"
              label="ROC-AUC"
            />

            <Metric
              value="0.3207"
              label="Average Precision"
            />

            <Metric
              value="40%"
              label="Precision@20"
            />

            <Metric
              value="40%"
              label="Precision@50"
            />

            <Metric
              value="24.02%"
              label="Holdout base rate"
            />

          </div>

        </PaperSection>


        <PaperSection
          id="interpretation"
          number="6"
          label="Interpretation"
          title="The signal is useful enough to prioritize, but too variable to automate."
        >

          <p>
            Random Forest improved mean
            Average Precision over the
            transparent baseline from
            <strong>
              {" "}0.3476 to 0.3616
            </strong>.
          </p>

          <p>
            Mean Precision@50 increased
            from
            <strong>
              {" "}34.4% to 36.8%
            </strong>,
            compared with a mean fold
            decline base rate of
            <strong>
              {" "}30.04%
            </strong>.
          </p>

          <p>
            This is measurable
            improvement, but it is
            modest.
          </p>


          <div className="evidence-strip">
            <div><strong>+0.0140</strong><span>AP vs baseline</span></div>
            <div><strong>1.36×</strong><span>Mean lift@20</span></div>
            <div><strong>1.30×</strong><span>Mean lift@50</span></div>
            <div><strong>0.69–2.01×</strong><span>Fold P@50 lift range</span></div>
          </div>

          <div className="interpretation-callout">

            <h3>
              The selected model is
              supported across the primary
              grouped-CV metrics.
            </h3>

            <p>
              Random Forest leads mean
              Average Precision, Precision@20,
              and Precision@50 in the final
              grouped-CV execution. The
              predeclared Average Precision
              criterion remains the official
              basis for selection.
            </p>

            <p>
              The evidence still does not
              establish universal superiority.
              The margins over the nonlinear
              alternative are modest and
              performance varies substantially
              across held-out client folds.
            </p>

          </div>


          <div className="result-synthesis">
            <span className="eyebrow">Result synthesis</span>
            <h3>The useful result is concentration near the top of the queue, not universal classification accuracy.</h3>
            <p>The transparent baseline already contains useful ranking information, so the Random Forest improvement is meaningful but deliberately described as modest. In the final grouped-CV execution, Random Forest leads the baseline on mean Average Precision and Precision@50, while its mean lift@20 and lift@50 remain above 1.0×.</p>
            <p>The fold-level range matters just as much as the averages. Precision@50 lift varies from <strong>0.69× to 2.01×</strong>, showing that the same ranking is substantially more useful for some held-out client compositions than for others. That variability is why the model remains development-stage decision support rather than a production-ready predictor.</p>
          </div>

          <h3>
            Error interpretation
          </h3>

          <p>
            Some non-declining pages
            receive high scores, while
            some later-declining pages
            receive low scores.
            Historical search behavior
            cannot observe seasonality,
            intent changes, competing
            pages, editorial decisions,
            SERP changes, or other
            client-specific events.
          </p>


          <h3>
            Feature importance
          </h3>

          <p>
            Feature importance describes
            what the fitted Random Forest
            relied on when constructing
            its ranking. It does not show
            that the most important
            historical features cause
            later decline.
          </p>

        </PaperSection>


        <PaperSection
          id="recommendations"
          number="7"
          label="Recommendation"
          title="Turn model rank into a human-review playbook."
          tinted
        >

          <div className="paper-prose recommendation-intro">
            <p>The intended users are content managers and editors who cannot manually inspect every page. The score determines <strong>review order only</strong>; it does not determine whether a page should be refreshed, rewritten, merged, redirected, deleted, or otherwise changed.</p>
            <p>High-ranked pages with meaningful historical visibility deserve earlier diagnosis, while weaker-evidence cases should be handled more cautiously. Strong-ranking pages may need protection before major edits, and visible pages with weak click capture may justify inspecting titles, snippets, and search intent rather than automatically changing metadata.</p>
          </div>

          <Workflow />


          <div className="action-grid">

            <ActionCard
              title="Review now"
              text="High model priority combined with meaningful historical visibility."
            />

            <ActionCard
              title="Protect and diagnose"
              text="A valuable page may have more to lose from an unnecessary intervention."
            />

            <ActionCard
              title="Review click capture"
              text="Visibility plus weak historical CTR can justify inspecting title, snippet, and intent."
            />

            <ActionCard
              title="Monitor"
              text="Weaker evidence should reduce confidence even when the model score is high."
            />

          </div>


          <ReasonExplorer
            reasonIndex={reasonIndex}
            setReasonIndex={setReasonIndex}
          />


          <div className="no-go">

            <span className="eyebrow">
              Automation boundary
            </span>

            <h3>
              The model should not
              automatically:
            </h3>

            <div className="no-go-grid">

              <span>
                Publish or rewrite content
              </span>

              <span>
                Refresh pages solely
                because risk is high
              </span>

              <span>
                Delete or prune pages
              </span>

              <span>
                Merge pages or create
                redirects
              </span>

              <span>
                Change metadata or
                canonicals
              </span>

              <span>
                Diagnose staleness or
                cannibalization
              </span>

              <span>
                Treat weak CTR as proof of
                a title problem
              </span>

              <span>
                Claim that an edit will
                recover traffic
              </span>

            </div>

          </div>
          <div className="review-loop-note">
            <span className="eyebrow">Human feedback loop</span>
            <h3>Record what the reviewer actually decided.</h3>
            <p>The playbook should capture whether a reviewer chooses <code>act</code>, <code>monitor</code>, or <code>dismiss</code>, together with a short reason. Future evaluation can then test whether the queue continues to focus limited review capacity where it is useful.</p>
          </div>

        </PaperSection>


        <PaperSection
          id="limitations"
          number="8"
          label="Limitations & honest framing"
          title="What this analysis cannot establish."
        >

          <div className="limitations-grid">

            <Limit
              title="Not yet a future deployment test"
              text="Grouped validation tests transfer across held-out clients, not stability across future calendar periods."
            />

            <Limit
              title="Operational outcome"
              text="A greater-than-20% impression decline describes what happened, not why it happened."
            />

            <Limit
              title="Important context is unobserved"
              text="Seasonality, intent, competition, editorial work, SERP changes, and client-specific events can affect outcomes."
            />

            <Limit
              title="No causal intervention claim"
              text="The model does not show that refreshing, rewriting, or consolidating a surfaced page will improve future performance."
            />

            <Limit
              title="Client-level variability"
              text="Performance differs substantially across held-out client groups."
            />

            <Limit
              title="Model choice remains close"
              text="HistGradientBoosting remains competitive, while Random Forest leads the final grouped-CV AP, P@20, and P@50 results."
            />

          </div>

        </PaperSection>


        <PaperSection
          id="reproducibility"
          number="9"
          label="Reproducibility"
          title="Trace every paper claim back to an executed artifact."
        >

          <p>
            The final Week 7 notebook is the frozen development implementation. The repository preserves the Week 1–7 progression from research question through validation audit and action playbook.
          </p>

          <p>
            Random seed: <code>42</code>. The final development evaluation uses client-grouped validation and remains distinct from a sealed future-month test.
          </p>

          <div className="repro-actions">
            <a className="button primary" href={repoUrl} target="_blank" rel="noopener noreferrer">
              View GitHub repository ↗
            </a>
            <a className="button secondary" href={notebookLinks[6].href} target="_blank" rel="noopener noreferrer">
              Open final Week 7 notebook ↗
            </a>
          </div>

          <div className="research-progression">
            <span className="eyebrow">Development progression</span>
            <div className="progression-row"><span>W1–W3</span><p>Define the future-looking review question, formalize the ML task, and establish the data contract.</p></div>
            <div className="progression-row"><span>W4–W5</span><p>Build a transparent comparator, then test learned ranking models against the same practical review objective.</p></div>
            <div className="progression-row"><span>W6</span><p>Audit leakage, split design, and the strength of the claims before carrying the model forward.</p></div>
            <div className="progression-row"><span>W7</span><p>Freeze the development specification and convert the selected model into a human-review action playbook.</p></div>
          </div>

          <h3>Project notebooks</h3>
          <div className="notebook-grid">
            {notebookLinks.map((notebook) => (
              <a
                className="notebook-link"
                key={notebook.week}
                href={notebook.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{notebook.week}</span>
                <strong>{notebook.title}</strong>
                <small>Open notebook ↗</small>
              </a>
            ))}
          </div>

          <h3>Final Week 7 artifacts</h3>
          <div className="artifact-list">
            <code>work/outputs/w07_model_comparison.csv</code>
            <code>work/outputs/w07_grouped_cv_results.csv</code>
            <code>work/outputs/w07_model_selection_sensitivity.csv</code>
            <code>work/outputs/w07_client_diagnostics.csv</code>
            <code>work/outputs/w07_playbook_metrics.json</code>
            <code>work/outputs/w07_ranked_action_queue.csv</code>
            <code>work/figures/w07_precision_at_k.png</code>
            <code>work/figures/w07_grouped_cv_stability.png</code>
          </div>

          <div className="design-review-note">
            <span className="eyebrow">Remaining evaluation</span>
            <h3>The frozen development
              specification should next
              be evaluated on an
              untouched later time
              period.</h3>
            <p>
                            A weaker future result
              should be reported as
              evidence about temporal
              generalization rather than
              used as a reason to retune
              the development model.
            </p>
          </div>

        </PaperSection>


        <section
          id="acknowledgments"
          className="acknowledgments"
        >

          <span className="eyebrow">
            10 · Acknowledgments & data
            credit
          </span>

          <h2>
            Built on the FlyRank ML
            Internship dataset.
          </h2>

          <p>
            Data and project context
            provided by{" "}
            <a
              href="https://flyrank.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              FlyRank
            </a>.
          </p>

          <p>
            This public research artifact uses pseudonymized search-performance data.
          </p>

          <p>
            Source code and notebooks are available in the{" "}
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
              public capstone repository
            </a>.
          </p>

        </section>

      </main>


      <footer>

        <span>
          Machine Learning Capstone · KARL MANGAHAS
        </span>

        <span>
          Measured · Directional ·
          Decision-support
        </span>

      </footer>

    </>
  );
}


function Hero() {
  return (
    <section className="hero">

      <div className="hero-copy">

        <span className="eyebrow">
          Machine Learning Capstone ·
          KARL MANGAHAS
        </span>

        <h1>
          Prioritizing content pages for
          <em> early human review.</em>
        </h1>

        <p>
          Can historical search behavior
          help editors identify which
          apparently stable pages deserve
          attention before visibility
          declines?
        </p>

        <div className="hero-actions">

          <a
            className="button primary"
            href="#evaluation"
          >
            Explore results
          </a>

          <a
            className="button secondary"
            href="#problem"
          >
            Read the paper
          </a>

        </div>

      </div>


      <div className="hero-result">

        <span>
          Selected development model
        </span>

        <h2>
          Random Forest
        </h2>

        <strong>
          0.3616
        </strong>

        <small>
          Mean grouped-CV Average
          Precision
        </small>


        <div className="hero-mini-grid">

          <Metric
            value="16,183"
            label="eligible pages"
          />

          <Metric
            value="24"
            label="clients"
          />

          <Metric
            value="36.8%"
            label="mean P@50"
          />

          <Metric
            value="30.04%"
            label="base rate"
          />

        </div>

      </div>

    </section>
  );
}


function PaperSection({
  id,
  number,
  label,
  title,
  tinted = false,
  dark = false,
  children,
}) {
  return (
    <section
      id={id}
      className={[
        "paper-section",
        tinted ? "tinted" : "",
        dark ? "dark-section" : "",
      ].join(" ")}
    >

      <div className="section-heading">

        <div>
          <span>
            {number}
          </span>

          <small>
            {label}
          </small>
        </div>

        <h2>
          {title}
        </h2>

      </div>

      <div className="section-content">
        {children}
      </div>

    </section>
  );
}


function Metric({
  value,
  label,
}) {
  return (
    <div className="metric-card">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}


function InfoCard({
  title,
  text,
}) {
  return (
    <article className="info-card">

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </article>
  );
}


function Check({
  children,
}) {
  return (
    <div className="check-row">

      <span>
        ✓
      </span>

      <p>
        {children}
      </p>

    </div>
  );
}


function Timeline() {
  return (
    <div className="timeline">

      <TimelineBlock
        title="Early 30d"
        subtitle="Historical level"
      />

      <span className="timeline-arrow">
        →
      </span>

      <TimelineBlock
        title="Middle 30d"
        subtitle="Historical movement"
      />

      <span className="timeline-arrow">
        →
      </span>

      <TimelineBlock
        title="Recent 30d"
        subtitle="Decision-time state"
        decision
      />

      <span className="timeline-arrow">
        →
      </span>

      <TimelineBlock
        title="Later 30d"
        subtitle="Observed outcome"
        outcome
      />

    </div>
  );
}


function TimelineBlock({
  title,
  subtitle,
  decision = false,
  outcome = false,
}) {
  return (
    <div
      className={
        outcome
          ? "timeline-block outcome"
          : "timeline-block"
      }
    >

      {decision && (
        <small className="decision-label">
          Decision point
        </small>
      )}

      <strong>
        {title}
      </strong>

      <span>
        {subtitle}
      </span>

    </div>
  );
}


function ModelCard({
  model,
}) {
  const selected =
    model.name === "Random Forest";

  return (
    <article
      className={
        selected
          ? "model-card selected"
          : "model-card"
      }
    >

      <span>
        {model.role}
      </span>

      <h3>
        {model.name}
      </h3>

      <p>
        Mean AP
        <strong>
          {" "}
          {model.ap.toFixed(3)}
        </strong>
      </p>

    </article>
  );
}


function MetricExplorer({
  metric,
  setMetric,
  metricInfo,
  maxValue,
}) {
  return (
    <div className="metric-explorer">

      <div className="metric-tabs">

        {Object.keys(metricInfo).map(
          (key) => (

            <button
              key={key}
              className={
                metric === key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMetric(key)
              }
            >
              {metricInfo[key].short}
            </button>

          )
        )}

      </div>


      <div className="metric-description">

        <h3>
          {metricInfo[metric].title}
        </h3>

        <p>
          {
            metricInfo[metric]
              .explanation
          }
        </p>

      </div>


      <div className="model-bars">

        {models.map((model) => {

          const value =
            model[metric];

          const width =
            (value / maxValue) * 100;

          return (
            <div
              className="model-bar-row"
              key={model.name}
            >

              <div className="bar-name">

                <strong>
                  {model.name}
                </strong>

                <span>
                  {model.role}
                </span>

              </div>


              <div className="bar-track">

                <div
                  className={
                    model.name ===
                    "Random Forest"
                      ? "bar-fill selected"
                      : "bar-fill"
                  }
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>


              <strong>
                {metric === "ap"
                  ? value.toFixed(3)
                  : `${(
                      value * 100
                    ).toFixed(1)}%`}
              </strong>

            </div>
          );
        })}

      </div>

    </div>
  );
}


function Workflow() {
  return (
    <div className="workflow">

      {[
        "Prioritize",
        "Inspect",
        "Diagnose",
        "Decide",
      ].map((step, index) => (
        <div
          className="workflow-step"
          key={step}
        >

          <span>
            0{index + 1}
          </span>

          <strong>
            {step}
          </strong>

        </div>
      ))}

    </div>
  );
}


function ActionCard({
  title,
  text,
}) {
  return (
    <article className="action-card">

      <span>
        ↗
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </article>
  );
}


function ReasonExplorer({
  reasonIndex,
  setReasonIndex,
}) {
  const selected =
    reasonCodes[reasonIndex];

  return (
    <div className="reason-explorer">

      <div className="reason-detail">

        <span className="eyebrow">
          Interactive reason-code explorer
        </span>

        <h3>
          {selected.title}
        </h3>

        <code className="selected-reason-code">
          {selected.code}
        </code>

        <p>
          {selected.meaning}
        </p>

        <div className="reason-use">

          <strong>
            How to interpret it
          </strong>

          <p>
            {selected.use}
          </p>

        </div>

        <p className="reason-boundary">
          Reason codes describe observable
          historical evidence used to explain
          why a page was surfaced. They do not
          establish the cause of future decline.
        </p>

      </div>


      <div className="reason-buttons">

        {reasonCodes.map(
          (reason, index) => (

            <button
              key={reason.code}
              type="button"
              className={
                index === reasonIndex
                  ? "active"
                  : ""
              }
              onClick={() =>
                setReasonIndex(index)
              }
              aria-pressed={
                index === reasonIndex
              }
            >
              {reason.code}
            </button>

          )
        )}

      </div>

    </div>
  );
}


function Limit({
  title,
  text,
}) {
  return (
    <article className="limit-card">

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </article>
  );
}


export default App;