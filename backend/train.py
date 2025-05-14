import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans

def load_data(data_path):

    df = pd.read_csv(data_path)
    
    # Data preparation
    # Convert date columns to datetime
    date_columns = ['agent_join_month', 'first_policy_sold_month', 'year_month']
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], format='%m/%d/%Y')
    
    # Calculate agent's experience (in months)
    df['experience_months'] = ((df['year_month'].dt.year - df['agent_join_month'].dt.year) * 12 + 
                                      (df['year_month'].dt.month - df['agent_join_month'].dt.month))
    
    # Calculate time to first sale (in months)
    # For agents who haven't sold yet, use a large number
    df['months_to_first_sale'] = np.where(
        pd.isna(df['first_policy_sold_month']),
        999,  # Large number for agents who haven't sold yet
        ((df['first_policy_sold_month'].dt.year - df['agent_join_month'].dt.year) * 12 + 
         (df['first_policy_sold_month'].dt.month - df['agent_join_month'].dt.month))
    )
    
    # Create a column to identify if an agent has already made their first sale
    df['has_made_first_sale'] = ~pd.isna(df['first_policy_sold_month']).astype(int)
    
    # Calculate proposal conversion rate
    df['proposal_to_quotation_rate'] = np.where(
        df['unique_proposal'] > 0,
        df['unique_quotations'] / df['unique_proposal'],
        0
    )
    
    # Calculate quotation conversion rate
    df['quotation_to_policy_rate'] = np.where(
        df['unique_quotations'] > 0,
        df['new_policy_count'] / df['unique_quotations'],
        0
    )
    
    # Calculate average policy value
    df['avg_policy_value'] = np.where(
        df['new_policy_count'] > 0,
        df['ANBP_value'] / df['new_policy_count'],
        0
    )
    
    # Calculate average income per policy
    df['avg_income_per_policy'] = np.where(
        df['new_policy_count'] > 0,
        df['net_income'] / df['new_policy_count'],
        0
    )
    
    # Calculate proposal activity in different time periods
    df['proposal_activity_7d'] = df['unique_proposals_last_7_days'] / 7
    df['proposal_activity_15d'] = df['unique_proposals_last_15_days'] / 15
    df['proposal_activity_21d'] = df['unique_proposals_last_21_days'] / 21
    
    # Calculate trend indicators for proposals
    df['proposal_trend_short'] = df['proposal_activity_7d'] - df['proposal_activity_15d']
    df['proposal_trend_med'] = df['proposal_activity_15d'] - df['proposal_activity_21d']
    
    # Calculate cash payment ratio
    df['cash_payment_ratio'] = np.where(
        df['new_policy_count'] > 0,
        df['number_of_cash_payment_policies'] / df['new_policy_count'],
        0
    )
    return df

def feature_enginnering(df):

    """
    Create additional features that might be relevant for prediction
    """

    df['target'] = (df['new_policy_count'] == 0).astype(int)

    # Calculate ratio of proposals to customers
    df['proposals_per_customer'] = np.where(
        df['unique_customers'] > 0,
        df['unique_proposal'] / df['unique_customers'],
        0
    )
    
    # Calculate ratio of quotations to customers
    df['quotations_per_customer'] = np.where(
        df['unique_customers'] > 0,
        df['unique_quotations'] / df['unique_customers'],
        0
    )
    
    # Calculate how close they are to their latest customers
    df['recent_customer_ratio'] = np.where(
        df['unique_customers'] > 0,
        df['unique_customers_last_7_days'] / df['unique_customers'],
        0
    )
    
    # Calculate policy holder ratio (if they have policy holders)
    df['policyholder_ratio'] = np.where(
        df['new_policy_count'] > 0,
        df['number_of_policy_holders'] / df['new_policy_count'],
        0
    )
    
    # Calculate activity decay (reduction in activity over time periods)
    df['proposal_decay_7_to_15'] = np.where(
        df['unique_proposals_last_15_days'] > 0,
        (df['unique_proposals_last_7_days'] / 7) / (df['unique_proposals_last_15_days'] / 15),
        0
    )
    
    df['quotation_decay_7_to_15'] = np.where(
        df['unique_quotations_last_15_days'] > 0,
        (df['unique_quotations_last_7_days'] / 7) / (df['unique_quotations_last_15_days'] / 15),
        0
    )
    
    # Create age group categories
    df['age_group'] = pd.cut(df['agent_age'], bins=[0, 25, 35, 45, 55, 100], 
                             labels=['<25', '25-35', '35-45', '45-55', '55+'])
    
    # Create experience group categories
    df['experience_group'] = pd.cut(df['experience_months'], bins=[-1, 3, 6, 12, 24, 100], 
                                   labels=['<3mo', '3-6mo', '6-12mo', '1-2yr', '>2yr'])
    
    # Get month and year features
    df['month'] = df['year_month'].dt.month
    df['year'] = df['year_month'].dt.year
    
    return df

def preprocess_data(df, target_col='target'):
    """
    Prepare the data for modeling
    """
    # Define features to use
    numeric_features = [
        'agent_age', 'experience_months', 'months_to_first_sale', 'has_made_first_sale',
        'unique_proposals_last_7_days', 'unique_proposals_last_15_days', 'unique_proposals_last_21_days',
        'unique_proposal', 'unique_quotations_last_7_days', 'unique_quotations_last_15_days',
        'unique_quotations_last_21_days', 'unique_quotations', 'unique_customers_last_7_days',
        'unique_customers_last_15_days', 'unique_customers_last_21_days', 'unique_customers',
        'new_policy_count', 'ANBP_value', 'net_income', 'number_of_policy_holders',
        'number_of_cash_payment_policies', 'proposal_to_quotation_rate', 'quotation_to_policy_rate',
        'avg_policy_value', 'avg_income_per_policy', 'proposal_activity_7d', 'proposal_activity_15d',
        'proposal_activity_21d', 'proposal_trend_short', 'proposal_trend_med', 'cash_payment_ratio',
        'proposals_per_customer', 'quotations_per_customer', 'recent_customer_ratio',
        'policyholder_ratio', 'proposal_decay_7_to_15', 'quotation_decay_7_to_15', 'month'
    ]
    
    categorical_features = ['age_group', 'experience_group']
    
    # Split features and target
    X = df[numeric_features + categorical_features]
    y = df[target_col]
    
    # Replace inf and -inf with NaN, then fill NaN with median/mode
    X = X.replace([np.inf, -np.inf], np.nan)
    
    # Fill missing values for numeric columns with median
    for col in numeric_features:
        X[col] = X[col].fillna(X[col].median())
    
    # Fill missing values for categorical columns with mode
    for col in categorical_features:
        X[col] = X[col].fillna(X[col].mode()[0])
    
    # Split into training and validation sets
    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Setup preprocessing for numeric and categorical features
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return X_train, y_train, preprocessor

def prepare_train_data(data_path):
    """
    Load and preprocess the data
    """
    # Load data
    df = load_data(data_path)
    
    # Feature engineering
    df = feature_enginnering(df)
    
    # Preprocess data
    X_train,y_train, preprocessor = preprocess_data(df)
    
    return X_train, y_train,preprocessor

def prepare_test_data(data_path):
    """
    Load and preprocess the test data
    """
    # Load data
    df = load_data(data_path)
    
    # Feature engineering
    df = feature_enginnering(df)
    return df

def prepare_data_for_clustering(data_path):
    """
    Load and preprocess the data for clustering
    """
    # Load data
    df = pd.read_csv(data_path)

    # Convert date columns to datetime format
    date_columns = ['agent_join_month', 'first_policy_sold_month', 'year_month']
    for col in date_columns:
        df[col] = pd.to_datetime(df[col])

    # Calculate tenure (months since joining)
    df['tenure_months'] = ((df['year_month'].dt.year - df['agent_join_month'].dt.year) * 12 + 
                            (df['year_month'].dt.month - df['agent_join_month'].dt.month))

    # Calculate months to first sale
    df['months_to_first_sale'] = ((df['first_policy_sold_month'].dt.year - df['agent_join_month'].dt.year) * 12 + 
                                    (df['first_policy_sold_month'].dt.month - df['agent_join_month'].dt.month))

    # Replace negative values with 0 (for cases where first_policy_sold_month is before agent_join_month)
    df['months_to_first_sale'] = df['months_to_first_sale'].clip(lower=0)

    # Calculate conversion rates
    df['proposal_to_quotation_rate'] = df['unique_quotations'] / df['unique_proposal'].replace(0, 1)
    df['quotation_to_policy_rate'] = df['new_policy_count'] / df['unique_quotations'].replace(0, 1)
    df['overall_conversion_rate'] = df['new_policy_count'] / df['unique_proposal'].replace(0, 1)

    # Calculate average policy value
    df['avg_policy_value'] = df['ANBP_value'] / df['new_policy_count'].replace(0, 1)

    # Calculate profit per policy
    df['profit_per_policy'] = df['net_income'] / df['new_policy_count'].replace(0, 1)

    # Calculate activity metrics
    df['activity_rate_7days'] = df['unique_proposals_last_7_days'] / 7
    df['activity_rate_15days'] = df['unique_proposals_last_15_days'] / 15
    df['activity_rate_21days'] = df['unique_proposals_last_21_days'] / 21

    # Calculate cash payment percentage
    df['cash_payment_percentage'] = df['number_of_cash_payment_policies'] / df['number_of_policy_holders'].replace(0, 1) * 100

    performance_features = [
        'new_policy_count',              # Sales volume
        'ANBP_value',                    # Total sales value
        'net_income',                    # Profitability
        'avg_policy_value',              # Quality of sales
        'profit_per_policy',             # Efficiency
        'overall_conversion_rate',       # Sales efficiency
        'proposal_to_quotation_rate',    # Stage 1 conversion
        'quotation_to_policy_rate',      # Stage 2 conversion
        'unique_proposals_last_21_days', # Recent activity
        'unique_proposals_last_7_days',
        'tenure_months',
        'activity_rate_21days',          # Consistency in prospecting
        'unique_customers'               # Customer reach
    ]

    # Select only the relevant features for performance evaluation
    performance_df = df[performance_features].copy()
    # Add agent code 
    performance_df['agent_code'] = df['agent_code']
    # Handle missing values
    performance_df.fillna(0, inplace=True)


    return performance_df, performance_features
    
    
def train_cluster_model(df, performance_features):
    # Select only numerical features for scaling
    numerical_features = df[performance_features].select_dtypes(include=['number']).columns
    
    # Standardize the selected numerical features
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df[numerical_features])

    # K-means clustering
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(scaled_features)

    # Analyze cluster centers (reverse scale them back to original space)
    cluster_centers = pd.DataFrame(scaler.inverse_transform(kmeans.cluster_centers_), columns=numerical_features)

    # Composite score based on feature importance
    weights = {
        'unique_proposals_last_21_days': 0.221,
        'activity_rate_21days': 0.194,
        'ANBP_value': 0.133,
        'new_policy_count': 0.126,
        'quotation_to_policy_rate': 0.082,
        'avg_policy_value': 0.078,
        'overall_conversion_rate': 0.054,
        'net_income': 0.046,
        'profit_per_policy': 0.033,
        'proposal_to_quotation_rate': 0.026,
        'unique_customers': 0.006
    }

    # Calculate the composite score for each cluster center using the weights
    composite_scores = cluster_centers[weights.keys()].multiply(list(weights.values()), axis=1).sum(axis=1)

    # Rank the clusters based on composite scores (higher score = better performance)
    cluster_rankings = composite_scores.rank(ascending=False)

    # Rank clusters based on composite score
    cluster_rankings = composite_scores.rank(ascending=False)
    performance_mapping = {}

    for cluster in range(3):
        if cluster_rankings[cluster] == 1:
            performance_mapping[cluster] = 'High'
        elif cluster_rankings[cluster] == 2:
            performance_mapping[cluster] = 'Medium'
        else:
            performance_mapping[cluster] = 'Low'

    return scaler, kmeans, performance_mapping



def predict_performance(test_data_path, scaler, kmeans, performance_mapping):

    # Prepare data for clustering
    test_df, _ = prepare_data_for_clustering(test_data_path)

    # Select only numerical columns for scaling (exclude 'agent_code' and any non-numeric columns)
    numerical_columns = test_df.select_dtypes(include=['number']).columns

    # Standardize using the previously fitted scaler
    scaled_test_features = scaler.transform(test_df[numerical_columns])

    # Predict cluster labels using the fitted KMeans model
    test_clusters = kmeans.predict(scaled_test_features)

    # Map the clusters to performance levels
    test_df['cluster'] = test_clusters
    test_df['performance_level'] = test_df['cluster'].map(performance_mapping)

    # Generate intervention strategies
    test_df = assign_intervention_strategies(test_df)

    # Return the results
    return test_df[['agent_code', 'performance_level', 'recommendations']]


def assign_intervention_strategies(df):
    # Precompute thresholds
    low_conv_thresh = df['overall_conversion_rate'].quantile(0.25)
    low_activity_thresh = df['activity_rate_21days'].quantile(0.25)
    low_value_thresh = df['avg_policy_value'].quantile(0.5)
    limited_customers_thresh = df['unique_customers'].quantile(0.5)

    def generate_recs(row):
        recs = []

        # Low performers
        if row['performance_level'] == 'Low':
            if row['overall_conversion_rate'] < low_conv_thresh:
                recs.append("Sales Training: Focus on improving conversion techniques and objection handling.")
            if row['activity_rate_21days'] < low_activity_thresh:
                recs.append("Activity Management: Set daily prospecting targets and provide closer supervision.")
            if row['tenure_months'] <= 6:
                recs.append("Mentorship Program: Pair with experienced agent for shadowing and guidance.")
            recs.extend([
                "Weekly Performance Review: Schedule weekly one-on-one sessions to review metrics and provide feedback.",
                "Product Knowledge: Complete refresher course on core products."
            ])

        # Medium performers
        elif row['performance_level'] == 'Medium':
            if row['avg_policy_value'] < low_value_thresh:
                recs.append("Upselling Training: Focus on identifying opportunities for premium products.")
            if abs(row['unique_proposals_last_21_days'] - 3 * row['unique_proposals_last_7_days']) > 5:
                recs.append("Consistency Program: Implement daily activity tracking and regular scheduling.")
            if row['unique_customers'] < limited_customers_thresh:
                recs.append("Networking Strategy: Provide resources for expanding customer base and referrals.")
            recs.extend([
                "Specialized Product Training: Advanced training on high-margin products.",
                "Monthly Group Coaching: Join peer group sessions to share best practices."
            ])

        # High performers
        elif row['performance_level'] == 'High':
            recs.extend([
                "Client Retention Program: Implement a structured follow-up system for existing clients.",
                "Leadership Development: Prepare for team leadership and mentoring roles.",
                "Advanced Sales Techniques: Training on complex products and high-net-worth client acquisition.",
                "Recognition Program: Highlight achievements in company communications and events.",
                "Career Path Planning: Set long-term goals and development plan for advancement."
            ])

        return recs

    # Apply recommendation generator to each row
    df['recommendations'] = df.apply(generate_recs, axis=1)
    return df




def train_model(X_train, y_train, preprocessor):
    """
    Train multiple models and select the best one
    """
    # Define models to try
    model = RandomForestClassifier(random_state=42)
        
    # Create pipeline with preprocessing
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])
        
    # Train the model
    pipeline.fit(X_train, y_train)

    return pipeline

def predict_sales(test_data_path, model):
    """
    Predict sales using the trained model
    """
    # Predict on test data
    test_data = prepare_test_data(test_data_path)
    
    # Predict on test data
    predictions = 1 - model.predict(test_data)

    test_data['prediction'] = predictions

    return test_data[['agent_code', 'prediction']]
    

if __name__ == "__main__":
    
    # Paths to data files
    train_data_path = '../datasets/train_storming_round.csv'
    test_data_path = '../datasets/test_storming_round.csv'

    # Prepare data
    X_train, y_train, preprocessor = prepare_train_data(train_data_path)
    model = train_model(X_train, y_train, preprocessor)
    
    performance_df, performance_features = prepare_data_for_clustering(train_data_path)
    scaler, kmeans, performance_mapping = train_cluster_model(performance_df, performance_features)

    sales_predictions = predict_sales(test_data_path, model)
    performance_predictions = predict_performance(test_data_path, scaler, kmeans, performance_mapping)

    # Merge predictions with performance data
    test_data = pd.merge(sales_predictions, performance_predictions, on='agent_code', how='left')
    
    # Save the final predictions to a CSV file
    test_data.to_csv('database.csv', index=False)

        