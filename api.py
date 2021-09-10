from flask import Flask, render_template, request, jsonify

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import euclidean_distances
from sklearn.manifold import MDS
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import math
from collections import OrderedDict

app = Flask(__name__)

dataframe = pd.read_csv('pokemon_filtered_data.csv')

dataframe.drop(columns = ['Type_1','Type_2','Color','Egg_Group_1','Body_Style','Number','Name'])

attributes = ['Total','HP','Attack','Defense','Sp_Atk','Sp_Def','Speed','Height_m','Weight_kg','Catch_Rate']

df = pd.DataFrame(data=dataframe, columns = attributes)

df_st = StandardScaler().fit_transform(df)
#
# cov_mat = np.cov(df_st.T)
# eig_vals, eig_vecs = np.linalg.eig(cov_mat)
# print('\nEigenvalues \n%s' %eig_vals)
#
#
# eig_pairs = [(np.abs(eig_vals[i]), eig_vecs[:,i]) for i in range(len(eig_vals))]
# print('Eigenvalues in descending order:')
# for i in eig_pairs:
#     print(i[0])


pca = PCA()
pca.fit_transform(df)

#Explained variance
pca = PCA().fit(df_st)
variance_ratio = pca.explained_variance_ratio_.tolist()

cumulative_var = 0
components = []
for i in range(len(variance_ratio)):
    variance_ratio[i] *= 100
    cumulative_var += variance_ratio[i]
    components.append([variance_ratio[i], str(i+1), cumulative_var])

di = 0

xcoord = np.dot(df_st,pca.components_[0])
ycoord = np.dot(df_st,pca.components_[1])

pca1 = pca.components_[0]
pca2 = pca.components_[1]
biplot_list = [xcoord, ycoord, pca1, pca2]

print(biplot_list)

@app.route('/')
def home():

    return render_template('index.html',pc = components, biplot_x = xcoord, biplot_y = ycoord, pca1 = pca1, pca2 = pca2)

@app.route('/di',methods=['GET','POST'])
def get_di():
    if request.method == 'POST':
        di = request.data

        di = int(request.data)
        loadings = pca.components_[0:di]
        columns = df.columns.tolist()
        pca_loadings = { i : 0 for i in df.columns }
        for i in range(di):
            for j in range(len(columns)):
                val = pca_loadings.get(columns[j])
                val += math.pow(loadings[i][j],2)
                pca_loadings[columns[j]] = val
        sorted_loadings = dict(sorted(pca_loadings.items(), key=lambda x: x[1], reverse=True))

        pca_dict = {}
        ctr = 0
        pca_str = "["
        for k in sorted_loadings.keys():
            pca_list = []
            if ctr <= 3:
                pca_str += "{\"Attribute\":\""+k+"\""
                dfindex = columns.index(k)
                for i in range(di):
                    pca_list.append(loadings[i][dfindex])
                    pca_str +=", \"PC"+str(i+1)+"\":\""+ str(loadings[i][dfindex])+"\""
                pca_dict[k] = pca_list
            ctr += 1
            if ctr <= 3:
                pca_str += "},"
        pca_str += "}]"
        return pca_str
    else:
        return render_template('index.html', pc = components)
    return '',200

@app.route('/kmeans-labels', methods=['GET'])
def getKmeansClusters():
    clusterDict={}
    kmLabels = KMeans(n_clusters = 3).fit(df).labels_
    clusterDict["clusters"] = kmLabels.tolist()
    return jsonify(clusterDict)

@app.route('/biplot_axes', methods=['GET'])
def getBiplotData():

    xcoord = np.dot(df_st,pca.components_[0])
    ycoord = np.dot(df_st,pca.components_[1])

    pca1 = pca.components_[0]
    pca2 = pca.components_[1]

    biplot_dict = {}
    biplot_dict["xcoord"] = xcoord.tolist()
    biplot_dict["ycoord"] = ycoord.tolist()
    biplot_dict["pca1"] = pca1.tolist()
    biplot_dict["pca2"] = pca2.tolist()
    biplot_dict["attributes"]=attributes

    return jsonify(biplot_dict)

@app.route('/mds-euclidean',methods = ['GET'])
def getEuclideanMds():
    mdsEuclidean = MDS(n_components=2).fit(df).embedding_

    xcoord = []
    ycoord = []
    for sublist in mdsEuclidean:
        xcoord.append(sublist[0])
        ycoord.append(sublist[1])

    mdsEuclidean_dict = {}
    mdsEuclidean_dict["xcoord"] = xcoord
    mdsEuclidean_dict["ycoord"] = ycoord

    return jsonify(mdsEuclidean_dict)

@app.route('/mds-correlation',methods = ['GET'])
def getCorrelationMds():

    corrmat = df.corr()

    corr_dmatrix = 1 - abs(corrmat)
    mdsCorrelation = MDS(n_components=2,dissimilarity='precomputed').fit(corr_dmatrix).embedding_

    xcoord = []
    ycoord = []
    for sublist in mdsCorrelation:
        xcoord.append(sublist[0])
        ycoord.append(sublist[1])

    mdsCorrelation_dict = {}
    mdsCorrelation_dict["xcoord"] = xcoord
    mdsCorrelation_dict["ycoord"] = ycoord
    mdsCorrelation_dict["attributes"]=attributes

    return jsonify(mdsCorrelation_dict)

if __name__ == '__main__':
    app.run(debug=True, port=5006)
