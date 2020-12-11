#!/bin/bash

apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list
apt-get update
apt-get install -y kubectl

wcurl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
mv minikube-linux-amd64 /usr/local/bin/minikube
chmod 755 /usr/local/bin/minikube

snap install helm --classic
minikube start --vm-driver=none

helm install postgres helm/postgres
while [ "$(kubectl get pods -l=app='postgres' -o jsonpath='{.items[*].status.phase}')" != "Running" ]; do
   sleep 5
   echo "Waiting for postgres to be ready."
done

echo "Postgres is ready"

helm install gift-advisor helm/gift-advisor
while [ "$(kubectl get pods -l=app='gift-advisor-backend' -o jsonpath='{.items[*].status.phase}')" != "Running" ] &
[ "$(kubectl get pods -l=app='gift-advisor-frontend' -o jsonpath='{.items[*].status.status.phase}')" != "Running" ]; do
   sleep 10
   echo "Waiting for gift advisor to be ready."
done

echo "Gift advisor is ready"

kubectl get pods

minikube service list