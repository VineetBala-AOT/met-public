FROM python:3.12.2-bullseye

ARG DAGSTER_VERSION=0.23.15

RUN pip install --upgrade pip
# ==> Add Dagster layer
RUN \
    pip install \
        dagster==1.7.15 \
        dagster-postgres==${DAGSTER_VERSION} \
        dagster-celery[flower,redis,kubernetes]==${DAGSTER_VERSION} \
        dagster-aws==${DAGSTER_VERSION} \
        dagster-k8s==${DAGSTER_VERSION} \
        dagster-celery-k8s==${DAGSTER_VERSION}

# Install the requirements
COPY ./requirements.txt .

RUN apt-get update && apt-get install -y git
RUN pip install --no-cache-dir -r requirements.txt

# ==> Add user code layer
# Example pipelines
COPY src/ /
RUN chmod -R g+rwX /opt
